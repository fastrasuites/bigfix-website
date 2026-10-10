<?php
/**
 * Enrich session with ip-api.com data (B2B detection)
 * POST /api/tracking/enrich.php
 * Body: {session_id}
 * Run async after session creation or via cron
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
if ($sessionId === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'session_id required']);
    exit;
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

    // Get session IP
    $stmt = $pdo->prepare('SELECT INET6_NTOA(`ip_address`) as ip FROM `tracking_sessions` WHERE `id` = ?');
    $stmt->execute([$sessionId]);
    $session = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$session || !$session['ip']) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Session not found']);
        exit;
    }

    $ip = $session['ip'];
    
    // Skip local/private IPs
    if (in_array($ip, ['127.0.0.1', '::1']) || 
        preg_match('/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/', $ip)) {
        echo json_encode(['success' => true, 'skipped' => true, 'reason' => 'Private IP']);
        exit;
    }

    // Call ip-api.com (free tier: 45 req/min, no key needed)
    $url = "http://ip-api.com/json/{$ip}?fields=status,country,countryCode,region,regionName,city,isp,org,query";
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'user_agent' => 'BigFix-Tracking/1.0',
        ]
    ]);
    
    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        throw new RuntimeException('ip-api.com request failed');
    }
    
    $data = json_decode($response, true);
    if (!$data || ($data['status'] ?? '') !== 'success') {
        throw new RuntimeException('ip-api.com returned error: ' . ($data['message'] ?? 'unknown'));
    }

    // B2B detection: org contains business keywords, exclude ISPs
    $org = $data['org'] ?? '';
    $isB2B = false;
    if ($org !== '') {
        $b2bKeywords = ['Ltd', 'Limited', 'Company', 'Group', 'Technologies', 'Solutions', 'Systems', 'Services', 'Corporation', 'Inc', 'Corp', 'LLC', 'PLC', 'GmbH', 'BV', 'SA', 'AG', 'AB', 'Oy', 'AS', 'KK', 'Pty'];
        $excludeKeywords = ['MTN', 'Airtel', 'Glo', 'ISP', 'Telecom', 'Telecommunications', 'Internet', 'Cloudflare', 'Amazon', 'AWS', 'Google', 'Microsoft', 'Azure', 'DigitalOcean', 'Linode', 'Vultr', 'Hetzner', 'OVH', 'Rackspace', 'SoftLayer', 'Equinix', 'Cogent', 'Level3', 'NTT', 'Verizon', 'AT&T', 'Comcast', 'Charter', 'Spectrum', 'Cox', 'Frontier', 'CenturyLink', 'Windstream'];
        
        $orgLower = strtolower($org);
        $isB2BCandidate = false;
        foreach ($b2bKeywords as $kw) {
            if (stripos($org, $kw) !== false) {
                $isB2BCandidate = true;
                break;
            }
        }
        
        $isExcluded = false;
        foreach ($excludeKeywords as $kw) {
            if (stripos($org, $kw) !== false) {
                $isExcluded = true;
                break;
            }
        }
        
        $isB2B = $isB2BCandidate && !$isExcluded;
    }

    // Update session with enrichment data
    $stmt = $pdo->prepare('
        UPDATE `tracking_sessions` SET
            `country_code` = ?,
            `region` = ?,
            `city` = ?,
            `isp` = ?,
            `org` = ?,
            `is_b2b` = ?
        WHERE `id` = ?
    ');
    $stmt->execute([
        $data['countryCode'] ?? null,
        $data['regionName'] ?? null,
        $data['city'] ?? null,
        $data['isp'] ?? null,
        $org ?: null,
        $isB2B,
        $sessionId
    ]);

    echo json_encode([
        'success' => true,
        'enriched' => true,
        'data' => [
            'country' => $data['country'] ?? null,
            'country_code' => $data['countryCode'] ?? null,
            'region' => $data['regionName'] ?? null,
            'city' => $data['city'] ?? null,
            'isp' => $data['isp'] ?? null,
            'org' => $org,
            'is_b2b' => $isB2B,
        ],
    ]);

} catch (Throwable $e) {
    error_log('Tracking enrichment error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Enrichment failed']);
}