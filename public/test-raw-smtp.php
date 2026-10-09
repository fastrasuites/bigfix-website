<?php
// Test raw fsockopen to smtp.zoho.com on various ports
$ports = [
    ['host' => 'smtp.zoho.com', 'port' => 587, 'tls' => true],
    ['host' => 'smtp.zoho.com', 'port' => 465, 'tls' => true],
    ['host' => 'mail.bigfixtech.com', 'port' => 465, 'tls' => true],
    ['host' => 'mail.bigfixtech.com', 'port' => 587, 'tls' => true],
    ['host' => 'localhost', 'port' => 25, 'tls' => false],
];

$user = 'info@bigfixtech.com';
$pass = 'Alw@ysthere@43212';

foreach ($ports as $p) {
    echo "\n=== {$p['host']}:{$p['port']} (TLS=" . ($p['tls'] ? 'yes' : 'no') . ") ===\n";

    $start = microtime(true);
    $sock = @fsockopen($p['host'], $p['port'], $errno, $errstr, 10);
    if (!$sock) {
        echo "CONNECT FAILED: ($errno) $errstr in " . round(microtime(true) - $start, 2) . "s\n";
        continue;
    }
    echo "Connected in " . round(microtime(true) - $start, 2) . "s\n";

    // Set timeout
    stream_set_timeout($sock, 15);

    if ($p['tls']) {
        // Try TLS handshake
        echo "Upgrading to TLS...\n";
        $crypto = @stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        if ($crypto !== true) {
            echo "TLS FAILED: " . $crypto . "\n";
            fclose($sock);
            continue;
        }
        echo "TLS OK\n";
    }

    // Read banner
    $banner = fgets($sock, 515);
    echo "Banner: " . trim($banner) . "\n";

    // EHLO
    fwrite($sock, "EHLO bigfixtech.com\r\n");
    while (!feof($sock)) {
        $line = fgets($sock, 515);
        if (substr($line, 3, 1) === ' ') break;
    }

    // AUTH LOGIN
    $userB64 = base64_encode($user);
    $passB64 = base64_encode($pass);

    fwrite($sock, "AUTH LOGIN\r\n");
    $resp = fgets($sock, 515);
    echo "AUTH LOGIN response: " . trim($resp) . "\n";

    fwrite($sock, $userB64 . "\r\n");
    $resp = fgets($sock, 515);
    echo "Username response: " . trim($resp) . "\n";

    fwrite($sock, $passB64 . "\r\n");
    $resp = fgets($sock, 515);
    echo "Password response: " . trim($resp) . "\n";

    if (strpos($resp, '235') === 0) {
        echo "AUTH SUCCESS! Credentials work on {$p['host']}\n";
    }

    fwrite($sock, "QUIT\r\n");
    fclose($sock);
}
