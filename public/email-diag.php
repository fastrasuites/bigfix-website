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

// --- DNS ---
$dnsOk = @checkdnsrr('smtp.zoho.com', 'MX');
$result['dns_mx'] = $dnsOk;
$records = @dns_get_record('smtp.zoho.com', DNS_A);
$result['dns_smtp_a'] = $records !== false ? count($records) . ' records' : 'false';

// --- Socket tests ---
$smtpHost = 'smtp.zoho.com';
$testPorts = [25, 465, 587, 585, 25025];
foreach ($testPorts as $port) {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen($smtpHost, $port, $errno, $errstr, 5);
    $result["smtp_{$smtpHost}_{$port}"] = [
        'connected' => $sock !== false,
        'error' => $errno ? "$errno: $errstr" : null,
        'ms' => round((microtime(true) - $start) * 1000, 1),
    ];
    if ($sock) {
        // Try to read greeting if connected
        $greeting = '';
        if (in_array($port, [25, 587])) {
            $greeting = trim(fgets($sock, 515) ?: '');
        }
        if ($greeting) $result["smtp_{$smtpHost}_{$port}"]['greeting'] = $greeting;
        fclose($sock);
    }
}

// --- Local SMTP ---
$start = microtime(true);
$errno = 0; $errstr = '';
$sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 3);
$result['local_smtp'] = [
    'connected' => $sock !== false,
    'error' => $errno ? "$errno: $errstr" : null,
    'ms' => round((microtime(true) - $start) * 1000, 1),
];
if ($sock) {
    $greeting = trim(fgets($sock, 515) ?: '');
    if ($greeting) $result['local_smtp']['greeting'] = $greeting;
    fclose($sock);
}

// --- PHP mail() ---
$start = microtime(true);
$r = @mail('info@bigfixtech.com', 'Test', 'body', "From: info@bigfixtech.com\r\n", '-f info@bigfixtech.com');
$result['php_mail'] = ['sent' => $r, 'ms' => round((microtime(true) - $start) * 1000, 1)];

// --- PHPMailer load test ---
$result['phpmailer_files'] = [
    'Exception.php' => file_exists(__DIR__ . '/phpmailer/Exception.php'),
    'PHPMailer.php' => file_exists(__DIR__ . '/phpmailer/PHPMailer.php'),
    'SMTP.php'      => file_exists(__DIR__ . '/phpmailer/SMTP.php'),
];

echo json_encode($result, JSON_PRETTY_PRINT);
