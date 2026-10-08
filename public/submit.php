<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

/**
 * Form submission endpoint for BigFix landing page.
 * Validates input, stores RAW (unescaped) data in MySQL, emails a notification via external SMTP (PHPMailer).
 * Escaping happens at OUTPUT time (email body, dashboard), never before storage.
 */

header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

function respond(int $code, array $body): void   // void (not never): PHP 8.1+ only, cPanel may run older PHP
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
$config = require $configFile;

// ---- CORS: only allow your own site(s) ----------------------------------
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

/** Trim, strip tags, remove control characters, cap length. Returns null if empty. */
function clean($v, int $max, bool $multiline = false): ?string   // untyped $v (not mixed): PHP 8.0+ only
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

// Honeypot: add a hidden <input name="website"> to your forms. Bots fill it, humans don't.
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
    'industry' => clean($input['industry'] ?? null, 100),   // legacy
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

    // ---- Self-healing: create the table if it does not exist yet ----------
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
            created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_source_created (source, created_at),
            KEY idx_email (email),
            KEY idx_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");


    // ---- Self-healing schema migration --------------------------------------
    $stmt = $pdo->query("SHOW TABLES LIKE 'submissions'");
    if ($stmt->fetchColumn()) {
        $stmt = $pdo->query("SHOW COLUMNS FROM submissions");
        $existing = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'Field');
        $add = [];
        foreach (['operation' => 'VARCHAR(150) NULL', 'timeline' => 'VARCHAR(50) NULL'] as $col => $type) {
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

// ---- Email notification (failure must not block success) ----------------
// Tries, in order: the configured SMTP account, the Resend API (if the
// config carries resend_api_key), then the server's local mail() - so a
// notification still goes out even when one method is unavailable. The
// method that succeeded ('smtp' | 'resend' | 'mail') or 'failed' is
// returned in the JSON response; every failure detail is written to the
// PHP error log (cPanel > Errors), never to the visitor.
$emailMode = 'failed';
try {
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

    $subject  = 'New Form Submission: ' . ucfirst(str_replace('_', ' ', $source)) . ' (ID: ' . $submissionId . ')';
    $fromAddr = trim((string)($config['from_email'] ?? ''));
    $fromName = str_replace(["\r", "\n"], '', (string)($config['from_name'] ?? 'BigFix Website'));
    $toAddr   = trim((string)($config['to_email'] ?? ''));
    if ($toAddr === '' && $fromAddr !== '') {
        $toAddr = $fromAddr;
    }
    $replyTo = (string)$data['email'];   // already validated above

    if ($fromAddr === '' || $toAddr === '') {
        error_log('Email: from_email/to_email missing in submit-config.php (submission ' . $submissionId . ')');
    } else {
        // --- 1) Configured SMTP account --------------------------------
        $smtpHost = trim((string)($config['smtp_host'] ?? ''));
        $smtpUser = trim((string)($config['smtp_user'] ?? ''));
        if ($smtpHost !== '') {
            try {
                $secure = (string)($config['smtp_secure'] ?? '');
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host        = $smtpHost;
                $mail->SMTPAuth    = $smtpUser !== '';
                $mail->Username    = $smtpUser;
                $mail->Password    = (string)($config['smtp_pass'] ?? '');
                $mail->SMTPSecure  = $secure;                  // '', 'ssl' or 'tls'
                $mail->SMTPAutoTLS = $secure !== '';
                $mail->Port        = (int)($config['smtp_port'] ?? ($secure === 'ssl' ? 465 : 587));
                $mail->CharSet     = 'UTF-8';
                $mail->Timeout     = 8;
                $mail->setFrom($fromAddr, $fromName);
                $mail->addAddress($toAddr);
                $mail->addReplyTo($replyTo, (string)($data['name'] ?? ''));
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body    = $htmlBody;
                $mail->AltBody = trim(strip_tags(str_replace(['</p>', '<hr>'], "\n", $htmlBody)));
                $mail->send();
                $emailMode = 'smtp';
            } catch (Throwable $e) {
                error_log('Email SMTP error (submission ' . $submissionId . '): ' . $e->getMessage());
            }
        } else {
            error_log('Email: smtp_host not configured in submit-config.php (submission ' . $submissionId . ')');
        }

        // --- 2) Resend API (config keys from the Resend era) ----------
        if ($emailMode === 'failed') {
            $apiKey = trim((string)($config['resend_api_key'] ?? ''));
            if ($apiKey !== '') {
                if (function_exists('curl_init')) {
                    $resendFrom = trim((string)($config['resend_from'] ?? ''));
                    if ($resendFrom === '') {
                        $resendFrom = $fromAddr;
                    }
                    $payload = json_encode([
                        'from'     => $fromName . ' <' . $resendFrom . '>',
                        'to'       => [$toAddr],
                        'reply_to' => $replyTo,
                        'subject'  => $subject,
                        'html'     => $htmlBody,
                    ]);
                    if ($payload !== false) {
                        $ch = curl_init();
                        curl_setopt_array($ch, [
                            CURLOPT_URL            => 'https://api.resend.com/emails',
                            CURLOPT_RETURNTRANSFER => true,
                            CURLOPT_POST           => true,
                            CURLOPT_HTTPHEADER     => [
                                'Authorization: Bearer ' . $apiKey,
                                'Content-Type: application/json',
                            ],
                            CURLOPT_POSTFIELDS     => $payload,
                            CURLOPT_TIMEOUT        => 8,
                        ]);
                        $response = curl_exec($ch);
                        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
                        $curlErr  = (string)curl_error($ch);
                        curl_close($ch);
                        if ($curlErr === '' && $httpCode >= 200 && $httpCode < 300) {
                            $emailMode = 'resend';
                        } else {
                            error_log('Email Resend error (submission ' . $submissionId . '): HTTP ' . $httpCode
                                . ' ' . $curlErr . ' ' . substr((string)$response, 0, 300));
                        }
                    }
                } else {
                    error_log('Email: curl extension missing, cannot use Resend (submission ' . $submissionId . ')');
                }
            }
        }

        // --- 3) Local mail() - works out of the box on cPanel ----------
        if ($emailMode === 'failed') {
            try {
                $headers  = 'From: ' . $fromName . ' <' . $fromAddr . '>' . "\r\n";
                $headers .= 'Reply-To: ' . $replyTo . "\r\n";
                $headers .= 'MIME-Version: 1.0' . "\r\n";
                $headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
                if (@mail($toAddr, $subject, $htmlBody, $headers)) {
                    $emailMode = 'mail';
                } else {
                    error_log('Email: mail() returned false (submission ' . $submissionId . ')');
                }
            } catch (Throwable $e) {
                error_log('Email mail() error (submission ' . $submissionId . '): ' . $e->getMessage());
            }
        }

        if ($emailMode === 'failed') {
            error_log('Email: all delivery methods failed (submission ' . $submissionId . ')');
        }
    }
} catch (Throwable $e) {
    error_log('Email error (submission ' . $submissionId . '): ' . $e->getMessage());
}

respond(200, [
    'success' => true,
    'message' => 'Submission received successfully',
    'id'      => $submissionId,
    'email'   => $emailMode,   // 'smtp' | 'resend' | 'mail' | 'failed'
]);
