<?php
declare(strict_types=1);
header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Catch ALL errors and warnings
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
});

$result = ['tests' => []];

// Test 1: DNS
try {
    $records = dns_get_record('smtp.zoho.com', DNS_A);
    $result['tests']['dns'] = 'ok - ' . count($records) . ' A records';
} catch (\Throwable $e) {
    $result['tests']['dns'] = 'ERROR: ' . $e->getMessage();
}

// Test 2: fsockopen to smtp.zoho.com:587
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 3);
    $result['tests']['smtp_587'] = $sock !== false ? 'connected in ' . round((microtime(true)-$start)*1000) . 'ms' : "FAILED: $errno $errstr";
    if ($sock) fclose($sock);
} catch (\Throwable $e) {
    $result['tests']['smtp_587'] = 'ERROR: ' . $e->getMessage();
}

// Test 3: fsockopen to smtp.zoho.com:465
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', 465, $errno, $errstr, 3);
    $result['tests']['smtp_465'] = $sock !== false ? 'connected in ' . round((microtime(true)-$start)*1000) . 'ms' : "FAILED: $errno $errstr";
    if ($sock) fclose($sock);
} catch (\Throwable $e) {
    $result['tests']['smtp_465'] = 'ERROR: ' . $e->getMessage();
}

// Test 4: Local SMTP
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 2);
    $result['tests']['local_25'] = $sock !== false ? 'connected in ' . round((microtime(true)-$start)*1000) . 'ms' : "FAILED: $errno $errstr";
    if ($sock) fclose($sock);
} catch (\Throwable $e) {
    $result['tests']['local_25'] = 'ERROR: ' . $e->getMessage();
}

// Test 5: PHP mail()
try {
    $start = microtime(true);
    $r = @mail('info@bigfixtech.com', 'Test', 'body', "From: info@bigfixtech.com\r\n", '-f info@bigfixtech.com');
    $result['tests']['php_mail'] = $r ? 'sent in ' . round((microtime(true)-$start)*1000) . 'ms' : 'FAILED (returned false)';
} catch (\Throwable $e) {
    $result['tests']['php_mail'] = 'ERROR: ' . $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
