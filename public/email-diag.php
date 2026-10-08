<?php
declare(strict_types=1);
header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Quick connectivity test — no socket hangs
$result = [];

// DNS
$records = @dns_get_record('smtp.zoho.com', DNS_A);
$result['dns'] = ['smtp.zoho.com has ' . (count($records) ?: 0) . ' A records'];

// Port tests (with very short timeout)
foreach ([25, 465, 587] as $port) {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', $port, $errno, $errstr, 3);
    $ok = $sock !== false;
    $greeting = '';
    if ($ok) {
        $greeting = trim(fgets($sock, 515) ?: '');
        fwrite($sock, "QUIT\r\n");
        fclose($sock);
    }
    $result["smtp_$port"] = [
        'connected' => $ok,
        'greeting' => $ok ? substr($greeting, 0, 80) : null,
        'error' => $ok ? null : "$errno: $errstr",
        'ms' => round((microtime(true) - $start) * 1000, 1),
    ];
}

// Local SMTP
$start = microtime(true);
$sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 2);
if ($sock) {
    $greeting = trim(fgets($sock, 515) ?: '');
    fwrite($sock, "QUIT\r\n");
    fclose($sock);
    $result['local_25'] = ['connected' => true, 'greeting' => substr($greeting, 0, 80), 'ms' => round((microtime(true) - $start) * 1000, 1)];
} else {
    $result['local_25'] = ['connected' => false, 'error' => "$errno: $errstr", 'ms' => round((microtime(true) - $start) * 1000, 1)];
}

// mail() availability
$result['mail_available'] = function_exists('mail');

echo json_encode($result, JSON_PRETTY_PRINT);
