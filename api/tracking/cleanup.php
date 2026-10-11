<?php
/**
 * Tracking Cleanup - Absolute Tracking
 * POST/GET /api/tracking/cleanup.php
 * 
 * Features:
 * - Deletes events older than 90 days
 * - Deletes non-converted sessions older than 1 year
 * - Probabilistic trigger (~1% of requests for shared hosting)
 */
declare(strict_types=1);

ignore_user_abort(true);

// Load config
$configFile = __DIR__ . '/../../submit-config.php';
if (!is_file($configFile)) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}

$config = require $configFile;

header('Content-Type: application/json');

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    // Check if tables exist
    $checkResult = $pdo->query("SHOW TABLES LIKE 'tracking_events'");
    if (!$checkResult->fetchColumn()) {
        echo json_encode([
            'success' => true,
            'skipped' => true,
            'message' => 'No tracking tables found',
        ]);
        exit;
    }

    // Check for Authorization token to allow manual trigger
    // Only authorized internal requests can force cleanup
    $authToken = $_SERVER['HTTP_X_CLEANUP_TOKEN'] ?? $_GET['token'] ?? '';
    $isAuthorized = $authToken === ($config['cleanup_token'] ?? 'bigfix-cleanup-2026');
    
    // If not authorized, use probabilistic trigger
    if (!$isAuthorized && mt_rand(1, 100) !== 1) {
        echo json_encode([
            'success' => true,
            'skipped' => true,
            'message' => 'Cleanup skipped (probabilistic trigger - 1% chance)',
        ]);
        exit;
    }

    // Delete events older than 90 days
    $eventsDeleted = $pdo->exec("
        DELETE FROM tracking_events 
        WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
    ");

    // Delete non-converted sessions older than 1 year
    $sessionsDeleted = $pdo->exec("
        DELETE FROM tracking_sessions 
        WHERE last_seen < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
        AND is_converted = FALSE
    ");

    echo json_encode([
        'success' => true,
        'events_deleted' => $eventsDeleted,
        'sessions_deleted' => $sessionsDeleted,
    ]);

} catch (Throwable $e) {
    error_log("Tracking cleanup error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Cleanup failed']);
}
