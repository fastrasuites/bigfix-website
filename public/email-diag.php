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

// --- Test SMTP auth to smtp.zoho.com:587 (which resolves to local Exim) ---
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 5);
    if ($sock) {
        $greeting = trim(fgets($sock, 515) ?: '');
        $result['smtp_connect'] = [
            'connected' => true,
            'greeting' => $greeting,
            'ms' => round((microtime(true) - $start) * 1000, 1),
        ];

        // EHLO
        fwrite($sock, "EHLO localhost\r\n");
        $ehlo = '';
        $startEhlo = microtime(true);
        while (!feof($sock)) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $ehlo .= $line;
            if (strpos(trim($line), '250 ') !== false || substr(trim($line), 3) === ' ') {
                if (strpos(trim($line), '250 ') !== false) break;
            }
            if (microtime(true) - $startEhlo > 3) break;
        }
        $result['smtp_connect']['ehlo'] = trim($ehlo);

        // STARTTLS
        fwrite($sock, "STARTTLS\r\n");
        $tls = '';
        $startTls = microtime(true);
        while (!feof($sock)) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $tls .= $line;
            if (strpos(trim($line), '220 ') !== false) break;
            if (microtime(true) - $startTls > 3) break;
        }
        $result['smtp_connect']['starttls'] = trim($tls);

        // After TLS, try AUTH PLAIN (no credentials)
        // Try to send a test email without auth first
        fwrite($sock, "MAIL FROM:<info@bigfixtech.com>\r\n");
        $mailResp = '';
        $startMail = microtime(true);
        while (!feof($sock)) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $mailResp .= $line;
            if (strpos(trim($line), '250 ') !== false) break;
            if (microtime(true) - $startMail > 3) break;
        }
        $result['smtp_connect']['mail_from'] = trim($mailResp);

        // Try RCPT TO
        fwrite($sock, "RCPT TO:<bigfixtech@gmail.com>\r\n");
        $rcptResp = '';
        $startRcpt = microtime(true);
        while (!feof($sock)) {
            $line = fgets($sock, 515);
            if ($line === false) break;
            $rcptResp .= $line;
            if (strpos(trim($line), '250 ') !== false || strpos(trim($line), '25') !== false) break;
            if (microtime(true) - $startRcpt > 3) break;
        }
        $result['smtp_connect']['rcpt_to'] = trim($rcptResp);

        // QUIT
        fwrite($sock, "QUIT\r\n");
        fclose($sock);
    } else {
        $result['smtp_connect'] = ['connected' => false, 'error' => "$errno: $errstr"];
    }
} catch (\Throwable $e) {
    $result['smtp_connect'] = 'ERROR: ' . $e->getMessage();
}

// --- Test sending via local SMTP without STARTTLS ---
try {
    $start = microtime(true);
    $errno = 0; $errstr = '';
    $sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 3);
    if ($sock) {
        fgets($sock, 515); // greeting
        fwrite($sock, "EHLO localhost\r\n");
        $buf = '';
        while (($line = fgets($sock, 515)) && !feof($sock)) {
            $buf .= $line;
            if (strpos(trim($line), '250 ') !== false) break;
        }
        $result['local_smtp'] = [
            'connected' => true,
            'ehlo_ok' => strpos($buf, '250') !== false,
        ];
        fwrite($sock, "QUIT\r\n");
        fclose($sock);
    } else {
        $result['local_smtp'] = ['connected' => false, 'error' => "$errno: $errstr"];
    }
} catch (\Throwable $e) {
    $result['local_smtp'] = 'ERROR: ' . $e->getMessage();
}

echo json_encode($result, JSON_PRETTY_PRINT);
