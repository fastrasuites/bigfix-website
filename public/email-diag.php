<?php
declare(strict_types=1);
header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

set_error_handler(function($errno, $errstr) {
    throw new ErrorException($errstr, 0, $errno);
});

$result = [];

// --- Check server config ---
try {
    $config = require __DIR__ . '/submit-config.php';
    $result['config'] = [
        'db_host' => $config['db_host'] ?? 'MISSING',
        'smtp_host' => $config['smtp_host'] ?? 'MISSING',
        'smtp_port' => $config['smtp_port'] ?? 'MISSING',
        'smtp_secure' => $config['smtp_secure'] ?? 'MISSING',
        'smtp_user' => $config['smtp_user'] ?? 'MISSING',
        'smtp_pass_length' => isset($config['smtp_pass']) ? strlen($config['smtp_pass']) : 'MISSING',
        'from_email' => $config['from_email'] ?? 'MISSING',
        'to_email' => $config['to_email'] ?? 'MISSING',
    ];
} catch (\Throwable $e) {
    $result['config'] = 'ERROR: ' . $e->getMessage();
}

// --- Test SMTP connection to smtp.zoho.com:587 ---
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 5);
    if ($sock) {
        $greeting = trim(fgets($sock, 515) ?: '');
        socket_set_timeout($sock, 5);
        $result['smtp_test'] = [
            'connected' => true,
            'greeting' => $greeting,
            'ms' => round((microtime(true) - $start) * 1000, 1),
        ];

        // Try EHLO
        fwrite($sock, "EHLO localhost\r\n");
        $ehloResp = '';
        while (($line = fgets($sock, 515)) && !feof($sock)) {
            $ehloResp .= $line;
            if (strpos($line, ' ') === 0 || strpos(trim($line), '250 ') === 0) break;
            if (strpos(trim($line), '250 ') === 0) break;
        }
        $result['smtp_test']['ehlo'] = trim($ehloResp);

        // Try STARTTLS
        fwrite($sock, "STARTTLS\r\n");
        $tlsResp = '';
        while (($line = fgets($sock, 515)) && !feof($sock)) {
            $tlsResp .= $line;
            if (strpos(trim($line), '220 ') === 0) break;
        }
        $result['smtp_test']['starttls'] = trim($tlsResp);
        fclose($sock);
    } else {
        $result['smtp_test'] = ['connected' => false, 'error' => "$errno: $errstr"];
    }
} catch (\Throwable $e) {
    $result['smtp_test'] = 'ERROR: ' . $e->getMessage();
}

// --- Test local SMTP on port 25 ---
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 3);
    if ($sock) {
        $greeting = trim(fgets($sock, 515) ?: '');
        $result['local_smtp_test'] = [
            'connected' => true,
            'greeting' => $greeting,
            'ms' => round((microtime(true) - $start) * 1000, 1),
        ];
        fclose($sock);
    } else {
        $result['local_smtp_test'] = ['connected' => false, 'error' => "$errno: $errstr"];
    }
} catch (\Throwable $e) {
    $result['local_smtp_test'] = 'ERROR: ' . $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
