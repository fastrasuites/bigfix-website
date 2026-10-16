<?php
/**
 * Initialize tracking session (API reference implementation)
 * POST /api/tracking/session/init.php
 * Returns: {success, session_id, company_name, is_b2b, expires_in}
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

// Load config
$config = null;
$configPaths = [
    __DIR__ . '/../../submit-config.php',
    __DIR__ . '/../../../submit-config.php',
];
foreach ($configPaths as $configFile) {
    if (is_file($configFile)) {
        $config = require $configFile;
        break;
    }
}

if ($config === null) {
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

    // Parse UTM parameters from query string
    $utmSource = $_GET['utm_source'] ?? '';
    $utmMedium = $_GET['utm_medium'] ?? '';
    $utmCampaign = $_GET['utm_campaign'] ?? '';
    $utmContent = $_GET['utm_content'] ?? '';
    $utmTerm = $_GET['utm_term'] ?? '';

    // Parse POST body
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    $landingPage = is_array($body) ? ($body['landing_page'] ?? '') : '';
    $referrer = is_array($body) ? ($body['referrer'] ?? '') : '';

    // Generate UUID v4
    $sessionId = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        random_int(0, 0xffff), random_int(0, 0xffff),
        random_int(0, 0x0fff) | 0x4000,
        random_int(0, 0x3fff) | 0x8000,
        random_int(0, 0xffff), random_int(0, 0xffff), random_int(0, 0xffff)
    );

    // Get client IP - check Cloudflare, then X-Forwarded-For, then REMOTE_ADDR
    $realIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if ($realIp === '') {
        $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($xff !== '') {
            $realIp = trim(explode(',', $xff)[0]);
        } else {
            $realIp = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        }
    }
    $realIp = trim($realIp);
    $ipBinary = inet_pton($realIp) ?: inet_pton('127.0.0.1');

    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';

    $stmt = $pdo->prepare('
        INSERT INTO `tracking_sessions` (
            `id`, `ip_address`, `user_agent`, `referrer`,
            `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`,
            `landing_page`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ');
    $stmt->execute([
        $sessionId, $ipBinary, $userAgent, $referrer,
        $utmSource, $utmMedium, $utmCampaign, $utmContent, $utmTerm,
        $landingPage,
    ]);

    $expires = time() + 31536000;
    setcookie('tracking_sid', $sessionId, [
        'expires' => $expires,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'company_name' => '',
        'is_b2b' => false,
        'expires_in' => 31536000,
    ]);

} catch (Throwable $e) {
    error_log('Tracking session init error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'session_id' => '',
        'company_name' => '',
        'is_b2b' => false,
        'error' => 'Failed to initialize session',
    ]);
}
