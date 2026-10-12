<?php
/**
 * Initialize tracking session - Absolute Tracking
 * POST /api/tracking/session/init.php
 * 
 * Request Body: {landing_page, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, user_agent}
 * Response: {session_id, company_name, is_b2b}
 * 
 * Features:
 * - Strict types, CORS from submit-config.php allowed_origins
 * - ignore_user_abort(true) for async processing
 * - UUID v4 session generation
 * - IP detection via CF_CONNECTING_IP, X_FORWARDED_FOR, REMOTE_ADDR
 * - Device detection + IP enrichment via lib classes
 * - INSERT... ON DUPLICATE KEY UPDATE last_seen=NOW(), page_count=page_count+1
 * - Cookie tracking_sid HttpOnly Secure SameSite=Lax 1yr
 */
declare(strict_types=1);

ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "DEBUG: init.php started\n";

ignore_user_abort(true);

// Load dependencies
$configFile = __DIR__ . '/../../../submit-config.php';
if (!is_file($configFile)) {
    // Try alternative paths
    $configFile = __DIR__ . '/../../../../submit-config.php';
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

// Load library classes with error handling
try {
    require_once __DIR__ . '/../../lib/IpEnricher.php';
    require_once __DIR__ . '/../../lib/DeviceDetector.php';
    require_once __DIR__ . '/../../lib/TrackingService.php';
} catch (\Throwable $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['error' => 'Library load error: ' . $e->getMessage()]);
    exit;
}

use BigFix\Tracking\IpEnricher;
use BigFix\Tracking\DeviceDetector;
use BigFix\Tracking\TrackingService;

// CORS headers - restrict to allowed origins
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
} else {
    header('Access-Control-Allow-Origin: ' . ($config['allowed_origins'][0] ?? ''));
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Cache-Control: no-store');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Parse input
$raw = file_get_contents('php://input');
if (strlen($raw) > 10000) {
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Payload too large']);
    exit;
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    // Try GET parameters for landing_page etc.
    $input = $_GET;
}

// Extract parameters
$landingPage = trim($input['landing_page'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$referrer = trim($input['referrer'] ?? $_SERVER['HTTP_REFERER'] ?? '');
$utmSource = trim($input['utm_source'] ?? '');
$utmMedium = trim($input['utm_medium'] ?? '');
$utmCampaign = trim($input['utm_campaign'] ?? '');
$utmContent = trim($input['utm_content'] ?? '');
$utmTerm = trim($input['utm_term'] ?? '');
$gclid = trim($input['gclid'] ?? '');
$fbclid = trim($input['fbclid'] ?? '');
$userAgent = trim($input['user_agent'] ?? $_SERVER['HTTP_USER_AGENT'] ?? '');

// Generate UUID v4
function generateUUIDv4(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // Version 4
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // Variant
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function getRealIp(): string {
    // Check Cloudflare first
    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        return $_SERVER['HTTP_CF_CONNECTING_IP'];
    }
    // Check X-Forwarded-For (first IP in chain)
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    // Standard REMOTE_ADDR
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

$sessionId = generateUUIDv4();
$clientIp = getRealIp();

try {
    // Database connection
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

    // Ensure tables exist (migration check)
    $checkTable = $pdo->query("SHOW TABLES LIKE 'tracking_sessions'");
    if (!$checkTable->fetchColumn()) {
        // Run migration if table doesn't exist
        $migrationFile = __DIR__ . '/../../migrations/003_absolute_tracking.sql';
        if (file_exists($migrationFile)) {
            $migrationSql = file_get_contents($migrationFile);
            // Extract only CREATE TABLE statements (not ALTER TABLE)
            $tables = [];
            if (preg_match_all('/CREATE TABLE[^;]+;/is', $migrationSql, $matches)) {
                foreach ($matches[0] as $stmt) {
                    $pdo->exec($stmt);
                }
            }
        }
    }

    // Initialize services
    $ipEnricher = new IpEnricher();
    $deviceDetector = new DeviceDetector();

    // Enrich IP
    $ipData = $ipEnricher->enrich($clientIp);
    list(
        $countryCode,
        $region,
        $city,
        $latitude,
        $longitude,
        $isp,
        $org,
        $companyName,
        $isB2B,
        $b2bConfidence
    ) = $ipData;

    // Detect device
    $deviceData = $deviceDetector->detect($userAgent);
    list(
        $deviceType,
        $deviceBrand,
        $deviceModel,
        $osName,
        $osVersion,
        $browserName,
        $browserVersion
    ) = $deviceData;

    // Parse referrer domain
    $referrerDomain = '';
    if ($referrer !== '') {
        $refParts = parse_url($referrer);
        $referrerDomain = $refParts['host'] ?? '';
    }

    // Insert or update session (upsert)
    $stmt = $pdo->prepare('
        INSERT INTO tracking_sessions (
            id, ip_address, user_agent,
            device_type, device_brand, device_model,
            os_name, os_version, browser_name, browser_version,
            country_code, region, city, latitude, longitude,
            isp, org, company_name, is_b2b, b2b_confidence,
            landing_page, referrer, referrer_domain,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term,
            gclid, fbclid
        ) VALUES (
            ?, INET6_ATON(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON DUPLICATE KEY UPDATE
            last_seen = NOW(),
            page_count = page_count + 1,
            ip_address = VALUES(ip_address),
            user_agent = VALUES(user_agent),
            device_type = VALUES(device_type),
            device_brand = VALUES(device_brand),
            device_model = VALUES(device_model),
            os_name = VALUES(os_name),
            os_version = VALUES(os_version),
            browser_name = VALUES(browser_name),
            browser_version = VALUES(browser_version),
            country_code = VALUES(country_code),
            region = VALUES(region),
            city = VALUES(city),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            isp = VALUES(isp),
            org = VALUES(org),
            company_name = VALUES(company_name),
            is_b2b = VALUES(is_b2b),
            b2b_confidence = VALUES(b2b_confidence),
            landing_page = VALUES(landing_page),
            referrer = VALUES(referrer)
    ');

    $stmt->execute([
        $sessionId,
        $clientIp,
        $userAgent,
        $deviceType,
        $deviceBrand,
        $deviceModel,
        $osName,
        $osVersion,
        $browserName,
        $browserVersion,
        $countryCode !== '' ? $countryCode : null,
        $region !== '' ? $region : null,
        $city !== '' ? $city : null,
        $latitude,
        $longitude,
        $isp !== '' ? $isp : null,
        $org !== '' ? $org : null,
        $companyName !== '' ? $companyName : null,
        $isB2B ? 1 : 0,
        $b2bConfidence,
        $landingPage !== '' ? $landingPage : null,
        $referrer !== '' ? $referrer : null,
        $referrerDomain !== '' ? $referrerDomain : null,
        $utmSource !== '' ? $utmSource : null,
        $utmMedium !== '' ? $utmMedium : null,
        $utmCampaign !== '' ? $utmCampaign : null,
        $utmContent !== '' ? $utmContent : null,
        $utmTerm !== '' ? $utmTerm : null,
        $gclid !== '' ? $gclid : null,
        $fbclid !== '' ? $fbclid : null,
    ]);

    // Set tracking cookie (1 year, HttpOnly, Secure, SameSite=Lax)
    $expires = time() + 31536000; // 1 year
    $cookieOptions = [
        'expires' => $expires,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ];
    setcookie('tracking_sid', $sessionId, $cookieOptions);

    // Also set localStorage-friendly cookie for frontend
    setcookie('bf_sid', $sessionId, $cookieOptions);

    // Return session info
    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'company_name' => $companyName,
        'is_b2b' => $isB2B,
    ]);

} catch (Throwable $e) {
    error_log('Tracking session init error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to initialize session']);
}
