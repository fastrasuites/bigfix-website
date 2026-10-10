<?php
/**
 * Probabilistic cleanup endpoint (triggered ~1% of requests)
 * GET /api/tracking/cleanup.php
 * Run via: cron daily OR probabilistic trigger from frontend
 */
declare(strict_types=1);

header('Content-Type: application/json');

$configFile = __DIR__ . '/../../../submit-config.php';
$config = require $configFile;

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

    // Probabilistic trigger: only run ~1% of the time
    // This avoids needing cron on shared hosting
    if (mt_rand(1, 100) !== 1) {
        echo json_encode([
            'success' => true,
            'skipped' => true,
            'message' => 'Cleanup skipped (probabilistic trigger)'
        ]);
        exit;
    }

    // Call stored procedure
    $stmt = $pdo->query('CALL CleanupTrackingData()');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    echo json_encode([
        'success' => true,
        'result' => $result['result'] ?? 'Cleanup completed',
    ]);

} catch (Throwable $e) {
    error_log('Tracking cleanup error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Cleanup failed']);
}