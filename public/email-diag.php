<?php
declare(strict_types=1);
header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$result = [];

// Test 1: Can we reach Zoho's REAL IP (not DNS-hijacked)?
$zohoRealIp = '136.143.190.56';
$start = microtime(true);
$errno = 0; $errstr = '';
$sock = @fsockopen($zohoRealIp, 587, $errno, $errstr, 5);
$result['zoho_real_ip_587'] = [
    'connected' => $sock !== false,
    'error' => $sock ? null : "$errno: $errstr",
    'ms' => round((microtime(true) - $start) * 1000, 1),
];
if ($sock) {
    $greeting = trim(fgets($sock, 515) ?: '');
    $result['zoho_real_ip_587']['greeting'] = substr($greeting, 0, 100);
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
}

// Test 2: Zoho IP port 465
$start = microtime(true);
$sock = @fsockopen($zohoRealIp, 465, $errno, $errstr, 5);
$result['zoho_real_ip_465'] = [
    'connected' => $sock !== false,
    'error' => $sock ? null : "$errno: $errstr",
    'ms' => round((microtime(true) - $start) * 1000, 1),
];
if ($sock) fclose($sock);

// Test 3: What IP does smtp.zoho.com resolve to ON THIS SERVER?
$records = @dns_get_record('smtp.zoho.com', DNS_A);
$result['smtp_zoho_com_resolves_to'] = $records !== false && count($records) > 0 ? $records[0]['ip'] : 'NO RECORDS';

// Test 4: Try connecting to smtp.zoho.com and check greeting
$start = microtime(true);
$sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 3);
$result['smtp_zoho_com_587'] = [
    'connected' => $sock !== false,
    'error' => $sock ? null : "$errno: $errstr",
    'ms' => round((microtime(true) - $start) * 1000, 1),
];
if ($sock) {
    $greeting = trim(fgets($sock, 515) ?: '');
    $result['smtp_zoho_com_587']['greeting'] = substr($greeting, 0, 100);
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
}

echo json_encode($result, JSON_PRETTY_PRINT);
