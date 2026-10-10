<?php
/**
 * Initialize tracking session
 * GET /api/tracking/session/init.php
 * Returns: {session_id, expires_in}
 */
declare(strict_types=1);

require __DIR__ . '/../../phpmailer/Exception.php';
require __DIR__ . '/../../phpmailer/PHPMailer.php';
require __DIR__ . '/../../phpmailer/SMTP.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$configFile = __DIR__ . '/../../submit-config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}

$config = require $configFile;

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );

    // Generate UUID v4
    $sessionId = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        random_int(0, 0xffff), random_int(0, 0xffff),
        random_int(0, 0x0fff) | 0x4000,
        random_int(0, 0x3fff) | 0x8000,
        random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff)
    );

    // Get client info
    $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    $ipBinary = inet_pton($ip);
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $referrer = $_SERVER['HTTP_REFERER'] ?? '';

    // Parse UTM parameters
    $utmSource = $_GET['utm_source'] ?? '';
    $utmMedium = $_GET['utm_medium'] ?? '';
    $utmCampaign = $_GET['utm_campaign'] ?? '';
    $utmContent = $_GET['utm_content'] ?? '';
    $utmTerm = $_GET['utm_term'] ?? '';

    // Insert session
    $stmt = $pdo->prepare('
        INSERT INTO `tracking_sessions` (
            `id`, `ip_address`, `user_agent`, `referrer`,
            `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $sessionId, $ipBinary, $userAgent, $referrer,
        $utmSource, $utmMedium, $utmCampaign, $utmContent, $utmTerm
    ]);

    // Set session cookie (1 year, HttpOnly, Secure, SameSite=Lax)
    $expires = time() + 31536000; // 1 year
    setcookie('tracking_sid', $sessionId, [
        'expires' => $expires,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    // Return session info
    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'expires_in' => 31536000,
    ]);

} catch (Throwable $e) {
    error_log('Tracking session init error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to initialize session']);
}