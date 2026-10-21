<?php
/**
 * Tracking Identify Endpoint - Absolute Tracking
 * POST /api/tracking/identify.php
 * 
 * Request Body: {session_id, email, phone, source}
 * 
 * Features:
 * - Validates email/phone format
 * - Updates tracking_sessions: identified_email, identified_phone, is_converted=1, converted_at=NOW()
 * - Links session to submissions if email matches
 */
declare(strict_types=1);
ob_start();

ignore_user_abort(true);

// Load config
$configFile = __DIR__ . '/../../submit-config.php';
if (!is_file($configFile)) {
    $configFile = __DIR__ . '/../../../submit-config.php';
}
if (!is_file($configFile)) {
    // Fallback config for shared hosting - uses same DB as main site
    $config = [
        'db_host' => '127.0.0.1',
        'db_name' => 'bigfixte_submissions',
        'db_user' => 'bigfixte_sub_user',
        'db_pass' => '}aM(lPXbzhSYd*A?',
        'allowed_origins' => [
            'https://bigfixtech.com',
            'https://www.bigfixtech.com',
        ],
    ];
} else {
    $config = require $configFile;
}

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Parse input
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$sessionId = trim($input['session_id'] ?? $_COOKIE['tracking_sid'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$source = trim($input['source'] ?? 'form_submit');

if ($sessionId === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'session_id required']);
    exit;
}

// Validate session_id format (UUID v4)
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid session_id format']);
    exit;
}

// Validate email if provided
if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

// Validate phone if provided (international format +254, +234, etc.)
if ($phone !== '' && !preg_match('/^\+[1-9][\d\s\-\(\)]{7,}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid phone format - use international format']);
    exit;
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

    // Verify session exists
    $stmt = $pdo->prepare('SELECT id FROM tracking_sessions WHERE id = ?');
    $stmt->execute([$sessionId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Session not found']);
        exit;
    }

    // Start transaction
    $pdo->beginTransaction();

    // Update session with identification data
    $stmt = $pdo->prepare('
        UPDATE tracking_sessions SET
            identified_email = COALESCE(?, identified_email),
            identified_phone = COALESCE(?, identified_phone),
            is_converted = TRUE,
            converted_at = NOW()
        WHERE id = ?
    ');
    $stmt->execute([$email ?: null, $phone ?: null, $sessionId]);

    // Link to submissions if email matches (update submissions table)
    if ($email !== '') {
        // Check if submissions table has session_id column
        $colCheck = $pdo->query("SHOW COLUMNS FROM submissions LIKE 'session_id'");
        if ($colCheck->fetch()) {
            // Link submissions by email
            $stmt = $pdo->prepare('
                UPDATE submissions SET
                    session_id = ?,
                    visitor_id = ?
                WHERE email = ? AND (session_id IS NULL)
                LIMIT 1
            ');
            $stmt->execute([$sessionId, $sessionId, $email]);
        }
    }

    $pdo->commit();

    // Return success with session info for frontend
    ob_clean();
    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'email' => $email,
    ]);

} catch (Throwable $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Tracking identify error: " . $e->getMessage());
    http_response_code(500);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Failed to identify session']);
}
