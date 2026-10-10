<?php
/**
 * Capture exit intent (email/phone before user leaves)
 * POST /api/tracking/exit-intent.php
 * Body: {session_id, email, phone, exit_type}
 */
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$sessionId = $input['session_id'] ?? '';
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$exitType = $input['exit_type'] ?? 'mouseleave';

if ($sessionId === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'session_id required']);
    exit;
}

if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid session_id format']);
    exit;
}

// Validate email if provided
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

// Validate phone if provided
if ($phone !== '' && !preg_match('/^[\d\s\-\+\(\)]{7,}$/', $phone)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid phone format']);
    exit;
}

$validExitTypes = ['mouseleave', 'scroll_up', 'back_button', 'blur'];
if (!in_array($exitType, $validExitTypes, true)) {
    $exitType = 'mouseleave';
}

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

    // Call stored procedure
    $stmt = $pdo->prepare('CALL CaptureExitIntent(?, ?, ?, ?)');
    $stmt->execute([$sessionId, $email, $phone, $exitType]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    // Also update session with exit intent data
    $pdo->prepare('
        UPDATE `tracking_sessions` 
        SET `exit_intent_captured` = TRUE,
            `exit_intent_email` = ?,
            `exit_intent_phone` = ?,
            `exit_intent_captured_at` = NOW()
        WHERE `id` = ?
    ')->execute([$email ?: null, $phone ?: null, $sessionId]);

    echo json_encode([
        'success' => true,
        'rows_updated' => $result['rows_updated'] ?? 0,
    ]);

} catch (Throwable $e) {
    error_log('Tracking exit intent error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to capture exit intent']);
}