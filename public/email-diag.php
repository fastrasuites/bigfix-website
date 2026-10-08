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

// Check if proc_open is available
$result['proc_open_available'] = function_exists('proc_open');

// Check sendmail binary exists
$result['sendmail_exists'] = file_exists('/usr/sbin/sendmail');
$result['exim_exists'] = file_exists('/usr/sbin/exim');

// Try to send a simple test email via sendmail pipe
try {
    $to = 'bigfixtech@gmail.com';
    $from = 'info@bigfixtech.com';
    $subject = 'Sendmail test';
    $body = 'Test message from sendmail pipe - ' . date('Y-m-d H:i:s');

    $headers = "From: $from\n";
    $headers .= "To: $to\n";
    $headers .= "Subject: $subject\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\n";

    $emailContent = $headers . "\n" . $body . "\n";

    $start = microtime(true);
    $fp = @popen('/usr/sbin/sendmail -t -f ' . escapeshellarg($from), 'w');
    $ok = false;
    if ($fp) {
        $written = fwrite($fp, $emailContent);
        $ok = pclose($fp) === 0;
    }
    $result['sendmail_test'] = [
        'started' => $fp !== false,
        'written' => $written ?? 0,
        'result' => $ok ? 'SUCCESS' : 'FAILED',
        'ms' => round((microtime(true) - $start) * 1000, 1),
    ];
} catch (\Throwable $e) {
    $result['sendmail_test'] = ['error' => $e->getMessage()];
}

// Also try exim directly
try {
    $result['exim_test'] = [
        'exists' => file_exists('/usr/sbin/exim'),
        'is_executable' => is_executable('/usr/sbin/exim'),
    ];
} catch (\Throwable $e) {
    $result['exim_test'] = ['error' => $e->getMessage()];
}

echo json_encode($result, JSON_PRETTY_PRINT);
