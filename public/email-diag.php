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

// Check for sendmail binary
$result['sendmail_paths'] = [];
foreach (['/usr/sbin/sendmail', '/usr/bin/sendmail', '/usr/sbin/exim', '/usr/sbin/postfix'] as $path) {
    $result['sendmail_paths'][$path] = file_exists($path);
}

// Test SMTP auth to local Exim (smtp.zoho.com:587 which resolves locally)
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 8);
    if ($sock) {
        $greeting = trim(fgets($sock, 515) ?: '');
        $result['smtp_test'] = ['greeting' => substr($greeting, 0, 80)];

        fwrite($sock, "EHLO localhost\r\n");
        $ehlo = '';
        $t0 = microtime(true);
        while (!feof($sock) && microtime(true) - $t0 < 5) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $ehlo .= $line;
            if (strpos(trim($line), '250 ') !== false) break;
        }
        $result['smtp_test']['ehlo_supports_starttls'] = strpos($ehlo, 'STARTTLS') !== false;
        $result['smtp_test']['ehlo_supports_auth'] = strpos($ehlo, 'AUTH') !== false ? trim(substr(strstr($ehlo, 'AUTH'), 0, 50)) : false;

        // STARTTLS
        fwrite($sock, "STARTTLS\r\n");
        $tls = '';
        $t0 = microtime(true);
        while (!feof($sock) && microtime(true) - $t0 < 5) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $tls .= $line;
            if (strpos(trim($line), '220 ') !== false) break;
        }
        $result['smtp_test']['starttls'] = trim($tls);

        // Enable TLS
        $crypto = @stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $result['smtp_test']['tls_enabled'] = $crypto === true;

        // Re-EHLO after TLS
        fwrite($sock, "EHLO localhost\r\n");
        $ehlo2 = '';
        $t0 = microtime(true);
        while (!feof($sock) && microtime(true) - $t0 < 5) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $ehlo2 .= $line;
            if (strpos(trim($line), '250 ') !== false) break;
        }
        $result['smtp_test']['auth_after_tls'] = strpos($ehlo2, 'AUTH') !== false ? 'AUTH supported' : 'AUTH not supported';

        // Try AUTH PLAIN with correct credentials
        $user = 'info@bigfixtech.com';
        $pass = 'Alw@ysthere@43212';
        $authPlain = base64_encode("\0$user\0$pass");

        fwrite($sock, "AUTH PLAIN $authPlain\r\n");
        $authResp = '';
        $t0 = microtime(true);
        while (!feof($sock) && microtime(true) - $t0 < 5) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $authResp .= $line;
        }
        $result['smtp_test']['auth_plain'] = trim(substr($authResp, 0, 200));

        fwrite($sock, "QUIT\r\n");
        fclose($sock);
    } else {
        $result['smtp_test'] = ['connected' => false, 'error' => "$errno: $errstr"];
    }
} catch (\Throwable $e) {
    $result['smtp_test']['error'] = $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
