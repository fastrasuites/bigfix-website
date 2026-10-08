<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

header('Content-Type: application/json');

$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized. Use ?pwd=bigfixtest']);
    exit;
}

$result = [];

$start = microtime(true);
$ips = dns_get_record('smtp.zoho.com', DNS_A + DNS_AAAA);
$result['dns'] = ['resolves' => count($ips) > 0, 'ips' => $ips, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
unset($start, $ips);

$start = microtime(true);
$errno = 0; $errstr = '';
$sock = @fsockopen('smtp.zoho.com', 587, $errno, $errstr, 5);
$result['smtp_587'] = ['connected' => $sock !== false, 'error' => $errno ? "$errno: $errstr" : null, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
if ($sock) fclose($sock);
unset($start);

$start = microtime(true);
$sock = @fsockopen('smtp.zoho.com', 465, $errno, $errstr, 5);
$result['smtp_465'] = ['connected' => $sock !== false, 'error' => $errno ? "$errno: $errstr" : null, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
if ($sock) fclose($sock);
unset($start);

$start = microtime(true);
$sock = @fsockopen('smtp.zoho.com', 25, $errno, $errstr, 5);
$result['smtp_25'] = ['connected' => $sock !== false, 'error' => $errno ? "$errno: $errstr" : null, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
if ($sock) fclose($sock);
unset($start);

$start = microtime(true);
$sock = @fsockopen('127.0.0.1', 25, $errno, $errstr, 3);
$result['local_smtp'] = ['connected' => $sock !== false, 'error' => $errno ? "$errno: $errstr" : null, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
if ($sock) fclose($sock);
unset($start);

$start = microtime(true);
$r = @mail('info@bigfixtech.com', 'Test email', 'Test body', "From: info@bigfixtech.com\r\n", '-f info@bigfixtech.com');
$result['php_mail'] = ['sent' => $r, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
unset($start);

foreach ([587, 465, 25] as $port) {
    $secure = ($port == 465) ? 'ssl' : 'tls';
    $start = microtime(true);
    try {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = 'smtp.zoho.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'info@bigfixtech.com';
        $mail->Password = 'Alw@ysthere@43212';
        $mail->SMTPSecure = $secure;
        $mail->SMTPAutoTLS = false;
        $mail->Port = $port;
        $mail->Timeout = 5;
        $mail->isHTML(false);
        $mail->setFrom('info@bigfixtech.com', 'BigFix Test');
        $mail->addAddress('bigfixtech@gmail.com');
        $mail->Subject = 'Diagnostic test (port ' . $port . ')';
        $mail->Body = 'Test message from diagnostic script.';
        $mail->send();
        $result['phpmailer_port_' . $port] = ['success' => true, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
    } catch (Exception $e) {
        $err = '';
        if (isset($mail)) { $err = $mail->ErrorInfo ?? $e->getMessage(); } else { $err = $e->getMessage(); }
        $result['phpmailer_port_' . $port] = ['success' => false, 'error' => $err, 'time_ms' => round((microtime(true) - $start) * 1000, 1)];
    }
}

echo json_encode($result, JSON_PRETTY_PRINT);
