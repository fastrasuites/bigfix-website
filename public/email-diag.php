<?php
declare(strict_types=1);

header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized. Use ?pwd=bigfixtest']);
    exit;
}

$result = [];

// Test DNS
$ips = dns_get_record('smtp.zoho.com', DNS_A + DNS_AAAA);
$result['dns'] = ['smtp.zoho.com' => count($ips) > 0 ? array_column($ips, 'ip') : 'NO RECORDS'];

// Test socket connections
foreach ([587, 465, 25, 585, 25025] as $port) {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', $port, $errno, $errstr, 5);
    $result["smtp_$port"] = [
        'connected' => $sock !== false,
        'error' => $errno ? "$errno: $errstr" : null,
        'time_ms' => round((microtime(true) - $start) * 1000, 1),
    ];
    if ($sock) fclose($sock);
}

// Test local SMTP (exim/sendmail)
$start = microtime(true);
$errno = 0; $errstr = '';
$sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 3);
$result['local_smtp'] = [
    'connected' => $sock !== false,
    'error' => $errno ? "$errno: $errstr" : null,
    'time_ms' => round((microtime(true) - $start) * 1000, 1),
];
if ($sock) fclose($sock);

// Test PHP mail()
$start = microtime(true);
$r = @mail('info@bigfixtech.com', 'Test', 'body', "From: info@bigfixtech.com\r\n", '-f info@bigfixtech.com');
$result['php_mail'] = ['sent' => $r, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];

// Check if PHPMailer is loadable
$result['phpmailer_check'] = [
    'Exception.php exists' => file_exists(__DIR__ . '/phpmailer/Exception.php'),
    'PHPMailer.php exists' => file_exists(__DIR__ . '/phpmailer/PHPMailer.php'),
    'SMTP.php exists' => file_exists(__DIR__ . '/phpmailer/SMTP.php'),
];

echo json_encode($result, JSON_PRETTY_PRINT);
