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
$result['php_functions'] = [
    'curl_init' => function_exists('curl_init'),
    'fsockopen' => function_exists('fsockopen'),
    'stream_socket_client' => function_exists('stream_socket_client'),
    'popen' => function_exists('popen'),
    'proc_open' => function_exists('proc_open'),
    'exec' => function_exists('exec'),
    'shell_exec' => function_exists('shell_exec'),
    'mail' => function_exists('mail'),
];

// Test HTTPS connectivity via curl
try {
    $ch = curl_init('https://www.google.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    $result['https_test'] = [
        'accessible' => $code > 0,
        'http_code' => $code,
        'error' => $err ?: null,
    ];
} catch (\Throwable $e) {
    $result['https_test'] = ['error' => $e->getMessage()];
}

// Test HTTPS to Zoho
try {
    $ch = curl_init('https://www.zoho.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    $result['zoho_https_test'] = [
        'accessible' => $code > 0,
        'http_code' => $code,
        'error' => $err ?: null,
    ];
} catch (\Throwable $e) {
    $result['zoho_https_test'] = ['error' => $e->getMessage()];
}

// Test stream_socket_client to Zoho SMTP via IP with TLS
try {
    $start = microtime(true);
    $sock = @stream_socket_client(
        "tlsv1.2://136.143.190.56:587",
        $errno,
        $errstr,
        5
    );
    $result['stream_ssl_zoho_ip'] = [
        'connected' => $sock !== false,
        'error' => $sock ? null : "$errno: $errstr",
        'ms' => round((microtime(true) - $start) * 1000, 1),
    ];
    if ($sock) {
        $greeting = trim(fgets($sock, 515) ?: '');
        $result['stream_ssl_zoho_ip']['greeting'] = substr($greeting, 0, 100);
        fclose($sock);
    }
} catch (\Throwable $e) {
    $result['stream_ssl_zoho_ip'] = ['error' => $e->getMessage()];
}

echo json_encode($result, JSON_PRETTY_PRINT);
