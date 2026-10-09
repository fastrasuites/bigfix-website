<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

// ---- Config -------------------------------------------------------------
$configFile = __DIR__ . '/submit-config.php';
if (!is_file($configFile)) {
    respond(500, ['success' => false, 'message' => 'Server configuration error']);
}

// Define placeholder constants that config files often reference as barewords
// (e.g. 'db_pass' => DB_PASS). On PHP 8.x these cause fatal errors if undefined.
foreach (['DB_PASS', 'DB_PASSWORD', 'ZOHO_APP_PASSWORD', 'ZOHO_PASSWORD', 'ZOHO_MAIL_PASSWORD', 'SMTP_PASS', 'SMTP_PASSWORD', 'SSO_PASS', 'APP_PASSWORD'] as $const) {
    if (!defined($const)) {
        define($const, '');
    }
}

try {
    $config = require $configFile;
} catch (\Error $e) {
    error_log('Config parse error in submit-config.php: ' . $e->getMessage());
    $config = [
        'db_host' => '127.0.0.1',
        'db_name' => 'bigfixte_submissions',
        'db_user' => 'bigfixte_sub_user',
        'db_pass' => '',
        'smtp_host' => 'smtp.zoho.com',
        'smtp_port' => 587,
        'smtp_secure' => 'tls',
        'smtp_user' => 'info@bigfixtech.com',
        'smtp_pass' => '',
        'from_email' => 'info@bigfixtech.com',
        'from_name' => 'BigFix Website',
        'to_email' => 'info@bigfixtech.com',
        'allowed_origins' => ['https://bigfixtech.com', 'https://www.bigfixtech.com'],
    ];
    error_log('Using default config — SMTP credentials missing, email will fail until submit-config.php is fixed');
}

// ---- CORS ---------------------------------------------------------------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['success' => false, 'message' => 'Method not allowed']);
}

// ---- Helpers ------------------------------------------------------------
function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function clean($v, int $max, bool $multiline = false): ?string
{
    if (!is_string($v) && !is_int($v) && !is_float($v)) {
        return null;
    }
    $v = trim(strip_tags((string)$v));
    $pattern = $multiline ? '/[^\P{C}\n]+/u' : '/\p{C}+/u';
    $v = preg_replace($pattern, '', $v) ?? '';
    $v = mb_substr($v, 0, $max);
    return $v === '' ? null : $v;
}

function isValidPhone(string $phone): bool
{
    $digits = preg_replace('/[^0-9]/', '', $phone) ?? '';
    return strlen($digits) >= 10 && strlen($digits) <= 15;
}

function isValidDate(string $d): bool
{
    $dt = DateTime::createFromFormat('Y-m-d', $d);
    return $dt !== false && $dt->format('Y-m-d') === $d;
}

// ---- Parse input --------------------------------------------------------
$raw = file_get_contents('php://input');
if (strlen($raw) > 50000) {
    respond(413, ['success' => false, 'message' => 'Payload too large']);
}
$input = json_decode($raw, true);
if (!is_array($input)) {
    $input = $_POST;
}

if (!empty($input['website'])) {
    respond(200, ['success' => true, 'message' => 'Submission received successfully']);
}

$allowedSources = ['contact', 'book_demo', 'home_review'];
$source = clean($input['source'] ?? null, 30);
if ($source === null || !in_array($source, $allowedSources, true)) {
    respond(400, ['success' => false, 'message' => 'Invalid form source']);
}

$data = [
    'source'   => $source,
    'name'     => clean($input['name'] ?? null, 100),
    'email'    => clean($input['email'] ?? null, 150),
    'phone'    => clean($input['phone'] ?? null, 30),
    'subject'  => clean($input['subject'] ?? null, 200),
    'message'  => clean($input['message'] ?? null, 5000, true),
    'company'  => clean($input['company'] ?? null, 150),
    'product'  => clean($input['product'] ?? null, 150),
    'industry' => clean($input['industry'] ?? null, 100),
    'operation' => clean($input['operation'] ?? null, 150),
    'timeline' => clean($input['timeline'] ?? null, 50),
    'users'    => clean($input['users'] ?? null, 50),
    'date'     => clean($input['date'] ?? null, 10),
    'time'     => clean($input['time'] ?? null, 20),
    'notes'    => clean($input['notes'] ?? null, 5000, true),
];

// ---- Validation ---------------------------------------------------------
$errors = [];

if ($data['name'] === null) {
    $errors[] = 'Name is required';
}
if ($data['email'] === null || filter_var($data['email'], FILTER_VALIDATE_EMAIL) === false) {
    $errors[] = 'Valid email is required';
}

switch ($source) {
    case 'contact':
        if ($data['subject'] === null) $errors[] = 'Subject is required';
        if ($data['message'] === null) $errors[] = 'Message is required';
        break;
    case 'book_demo':
        if ($data['company'] === null) $errors[] = 'Company name is required';
        if ($data['phone'] === null || !isValidPhone($data['phone'])) $errors[] = 'Valid phone number is required';
        if ($data['date'] === null || !isValidDate($data['date'])) $errors[] = 'Valid date is required (YYYY-MM-DD)';
        if ($data['time'] === null) $errors[] = 'Time is required';
        break;
    case 'home_review':
        if ($data['company'] === null) $errors[] = 'Company name is required';
        if ($data['product'] === null) $errors[] = 'Product of interest is required';
        if ($data['operation'] === null) $errors[] = 'Primary operation is required';
        if ($data['timeline'] === null) $errors[] = 'Estimated project timeline is required';
        break;
}

if ($errors) {
    respond(400, ['success' => false, 'message' => 'Validation errors', 'errors' => $errors]);
}

// ---- Database -----------------------------------------------------------
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS submissions (
            id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
            source     VARCHAR(30)  NOT NULL,
            name       VARCHAR(100) NOT NULL,
            email      VARCHAR(150) NOT NULL,
            subject    VARCHAR(200) NULL,
            message    TEXT         NULL,
            phone      VARCHAR(30)  NULL,
            date       DATE         NULL,
            time       VARCHAR(20)  NULL,
            users      VARCHAR(50)  NULL,
            notes      TEXT         NULL,
            company    VARCHAR(150) NULL,
            product    VARCHAR(150) NULL,
            operation  VARCHAR(150) NULL,
            timeline   VARCHAR(50)  NULL,
            industry   VARCHAR(100) NULL,
            email_status VARCHAR(20)  NULL,
            email_error  VARCHAR(500) NULL,
            created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_source_created (source, created_at),
            KEY idx_email (email),
            KEY idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $stmt = $pdo->query("SHOW TABLES LIKE 'submissions'");
    if ($stmt->fetchColumn()) {
        $stmt = $pdo->query("SHOW COLUMNS FROM submissions");
        $existing = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        $add = [];
        foreach (['operation' => 'VARCHAR(150) NULL', 'timeline' => 'VARCHAR(50) NULL', 'email_status' => 'VARCHAR(20) NULL', 'email_error' => 'VARCHAR(500) NULL'] as $col => $type) {
            if (!in_array($col, $existing, true)) {
                $add[] = "ADD COLUMN $col $type";
            }
        }
        if ($add) {
            $pdo->exec('ALTER TABLE submissions ' . implode(', ', $add));
        }
    }

    $stmt = $pdo->prepare('
        INSERT INTO submissions
            (source, name, email, phone, subject, message, company, product, operation, timeline, industry, users, date, time, notes, created_at)
        VALUES
            (:source, :name, :email, :phone, :subject, :message, :company, :product, :operation, :timeline, :industry, :users, :date, :time, :notes, NOW())
    ');
    $stmt->execute($data);
    $submissionId = (int)$pdo->lastInsertId();
} catch (PDOException $e) {
    error_log('Submission DB error: ' . $e->getMessage());
    respond(500, ['success' => false, 'message' => 'Could not save your submission. Please try again.']);
}

// ---- Email notification via Zoho SMTP -------------------------------------------------
$emailMode = 'failed';
$emailError = '';

$resolve = static function (array $c, string ...$keys): string {
    foreach ($keys as $key) {
        if (array_key_exists($key, $c) && trim((string)$c[$key]) !== '') {
            return (string)$c[$key];
        }
    }
    return '';
};

$fromAddr = $resolve($config, 'from_email', 'from', 'from_addr') ?: 'info@bigfixtech.com';
$toAddr   = $resolve($config, 'to_email', 'to', 'to_addr') ?: $fromAddr;
$fromName = str_replace(["\r", "\n"], '', (string)($config['from_name'] ?? 'BigFix Website'));
$subject  = 'New BigFix Form Submission: ' . ucfirst(str_replace('_', ' ', $source)) . ' (ID: ' . $submissionId . ')';
$replyTo  = (string)$data['email'];

$htmlBody  = '<h2>New BigFix Form Submission</h2>';
$htmlBody .= '<p><strong>Source:</strong> ' . h($source) . '</p>';
$htmlBody .= '<p><strong>Submission ID:</strong> ' . $submissionId . '</p><hr>';

foreach (['name', 'email', 'phone', 'subject', 'company', 'product', 'operation', 'timeline', 'industry', 'users', 'date', 'time'] as $f) {
    if ($data[$f] !== null) {
        $htmlBody .= '<p><strong>' . h(ucfirst($f)) . ':</strong> ' . h($data[$f]) . '</p>';
    }
}
foreach (['message' => 'Message', 'notes' => 'Notes'] as $f => $label) {
    if ($data[$f] !== null) {
        $htmlBody .= "<p><strong>{$label}:</strong></p><p>" . nl2br(h($data[$f])) . '</p>';
    }
}
$htmlBody .= '<hr><p>Submitted on: ' . date('Y-m-d H:i:s') . '</p>';

$alt = trim(strip_tags(str_replace(['</p>', '<hr>', '<br>'], "\n", $htmlBody)));

if ($fromAddr === '' || $toAddr === '') {
    error_log('Email: from_email/to_email missing in submit-config.php (submission ' . $submissionId . ')');
} else {
    try {
        $smtpHost = $resolve($config, 'smtp_host') ?: 'smtp.zoho.com';
        $smtpUser = $resolve($config, 'smtp_user', 'smtp_username');
        $smtpPass = $resolve($config, 'smtp_pass', 'smtp_password');
        $smtpPort = (int)($resolve($config, 'smtp_port') ?: 587);
        $smtpSecure = $resolve($config, 'smtp_secure') ?: 'tls';

        $tryHosts = [];
        // Primary: configured host
        $tryHosts[] = [$smtpHost, $smtpPort, $smtpSecure, $smtpUser, $smtpPass, true];

        // Fallback: smtp.zoho.com:587 TLS and :465 SSL (for when local Exim rejects auth)
        $lowerHost = strtolower((string)$smtpHost);
        if ($smtpUser !== '' && $smtpPass !== '' && strpos($lowerHost, 'smtp.zoho.com') === false) {
            $tryHosts[] = ['smtp.zoho.com', 587, 'tls', $smtpUser, $smtpPass, true];
            $tryHosts[] = ['smtp.zoho.com', 465, 'ssl', $smtpUser, $smtpPass, true];
        }

        // Fallback: localhost:25 no-auth (local Exim relay — routes via domain MX records)
        $tryHosts[] = ['localhost', 25, '', '', '', false];

        // Store results from ALL attempts for debugging
        $allDebugs = [];
        $allErrors = [];

        foreach ($tryHosts as $idx => $h) {
            $debugLog = '';
            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host       = $h[0];
                $mail->Port       = $h[1];
                $mail->SMTPSecure = $h[2];
                $mail->SMTPAutoTLS = false;
                $mail->SMTPAuth   = $h[5];
                if ($h[5]) {
                    $mail->Username   = $h[3];
                    $mail->Password   = $h[4];
                }
                $mail->Timeout    = 15;
                $mail->CharSet    = 'UTF-8';

                // On shared hosting, OpenSSL CA bundle is often outdated — skip verification
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true,
                    ],
                ];

                // Always capture debug to see server banners
                $mail->SMTPDebug = 2;
                $mail->Debugoutput = function (string $str, string $level) use (&$debugLog) {
                    $debugLog .= "[$level] $str\n";
                };

                $mail->setFrom($fromAddr, $fromName);
                $mail->addAddress($toAddr);
                $mail->addReplyTo($replyTo, (string)($data['name'] ?? ''));
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body    = $htmlBody;
                $mail->AltBody = $alt;

                $mail->send();
                $emailMode = $idx === 0 ? 'smtp' : 'smtp_zoho';
                $emailError = '';
                if ($idx > 0) {
                    error_log('Email: primary SMTP failed, fallback to ' . $h[0] . ' succeeded (submission ' . $submissionId . ')');
                }
                if (!empty($debugLog)) {
                    $allDebugs[] = "SUCCESS via {$h[0]}:{$h[1]}\n" . $debugLog;
                }
                break;
            } catch (Throwable $e) {
                $err = $e->getMessage();
                if (isset($mail->ErrorInfo)) {
                    $err .= ' | ErrorInfo: ' . $mail->ErrorInfo;
                }
                error_log('Email SMTP error on ' . $h[0] . ':' . $h[1] . ' (submission ' . $submissionId . '): ' . $err);
                $allErrors[] = "[{$h[0]}:{$h[1]}] " . substr($err, 0, 100);
                if (!empty($debugLog)) {
                    $allDebugs[] = "FAILED {$h[0]}:{$h[1]}\n" . $debugLog;
                }
            }
        }

        if ($emailMode === 'failed') {
            $emailError = substr($err ?? '', 0, 200);
            if (!empty($allErrors)) {
                $emailError = implode("\n", $allErrors);
            }
            if (!empty($allDebugs)) {
                $emailError .= "\n--- Debug (last attempt) ---\n" . substr(end($allDebugs), 0, 800);
            }
        }

        if ($emailMode === 'failed' && ($smtpHost === '' || $smtpPort === 0)) {
            $emailError = 'SMTP host and port are required in submit-config.php';
            error_log('Email: ' . $emailError . ' (submission ' . $submissionId . ')');
        } elseif ($emailMode === 'failed' && ($smtpUser === '' || $smtpPass === '')) {
            $emailError = 'smtp_user and smtp_pass are required in submit-config.php';
            error_log('Email: ' . $emailError . ' (submission ' . $submissionId . ')');
        }
    } catch (Throwable $e) {
        error_log('Email SMTP setup error (submission ' . $submissionId . '): ' . $e->getMessage());
        $emailError = substr($e->getMessage(), 0, 200);
    }
}

// Record the outcome
try {
    $upd = $pdo->prepare('UPDATE submissions SET email_status = :s, email_error = :e WHERE id = :id');
    $upd->execute([
        ':s'  => $emailMode,
        ':e'  => $emailMode === 'failed' && $emailError !== '' ? $emailError : null,
        ':id' => $submissionId,
    ]);
} catch (Throwable $e) {
    error_log('Could not store email status (submission ' . $submissionId . '): ' . $e->getMessage());
}

respond(200, [
    'success' => true,
    'message' => 'Submission received successfully',
    'id'      => $submissionId,
    'email'   => $emailMode,
    'debug'   => $emailMode === 'failed' ? $emailError : null,
]);
