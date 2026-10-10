<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

require __DIR__ . '/phpmailer/Exception.php';
require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';

/**
 * Send email via HTTP API (Zoho ZeptoMail, SendGrid, Mailgun, etc.)
 * Uses HTTPS (port 443) - NOT blocked by QServers firewall
 * Bypasses SMTP entirely
 */
function sendViaHttpApi(array $config, string $fromAddr, string $fromName, string $toAddr, string $subject, string $htmlBody, string $altBody): array
{
    $apiUrl = $config['email_api_url'] ?? '';
    $apiKey = $config['email_api_key'] ?? '';
    $apiType = $config['email_api_type'] ?? 'zeptomail';

    if ($apiUrl === '' || $apiKey === '') {
        return ['success' => false, 'error' => 'HTTP email API not configured'];
    }

    $payload = [];
    $headers = [
        'Content-Type: application/json',
        'Authorization: ' . ($apiType === 'zeptomail' ? 'Zoho-enczapikey ' : 'Bearer ') . $apiKey,
    ];

    switch ($apiType) {
        case 'zeptomail':
            // Zoho ZeptoMail API
            // Docs: https://www.zeptomail.com/docs/api/send-mail/
            $payload = [
                'from' => [
                    'address' => $fromAddr,
                    'name' => $fromName,
                ],
                'to' => [
                    [
                        'email_address' => [
                            'address' => $toAddr,
                            'name' => $fromName,
                        ],
                    ],
                ],
                'subject' => $subject,
                'htmlbody' => $htmlBody,
                'textbody' => $altBody,
            ];
            break;

        case 'sendgrid':
            // SendGrid API
            // Docs: https://docs.sendgrid.com/api-reference/mail-send/mail-send
            $payload = [
                'personalizations' => [[
                    'to' => [['email' => $toAddr]],
                    'subject' => $subject,
                ]],
                'from' => ['email' => $fromAddr, 'name' => $fromName],
                'content' => [
                    ['type' => 'text/plain', 'value' => $altBody],
                    ['type' => 'text/html', 'value' => $htmlBody],
                ],
            ];
            break;

        case 'mailgun':
            // Mailgun API (uses multipart/form-data, not JSON)
            return ['success' => false, 'error' => 'Mailgun requires multipart - implement separately'];
            break;

        case 'brevo':
            // Brevo (Sendinblue) API
            // Docs: https://developers.brevo.com/reference/sendtransacemail
            $payload = [
                'sender' => ['email' => $fromAddr, 'name' => $fromName],
                'to' => [['email' => $toAddr, 'name' => $fromName]],
                'subject' => $subject,
                'htmlContent' => $htmlBody,
                'textContent' => $altBody,
            ];
            break;

        default:
            return ['success' => false, 'error' => "Unknown API type: $apiType"];
    }

    $ch = curl_init($apiUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error !== '') {
        return ['success' => false, 'error' => "cURL error: $error"];
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        return ['success' => true];
    }

    return ['success' => false, 'error' => "HTTP $httpCode: " . substr($response, 0, 200)];
}

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
        // ============================================================
        // METHOD 1: HTTP API (PRIMARY) - Uses HTTPS port 443, NOT blocked
        // ============================================================
        $apiUrl  = $config['email_api_url'] ?? '';
        $apiKey  = $config['email_api_key'] ?? '';
        $apiType = $config['email_api_type'] ?? 'zeptomail';

        $emailMode = 'failed';
        $emailError = '';
        $allDebugs = [];
        $allErrors = [];

        if ($apiUrl !== '' && $apiKey !== '') {
            try {
                $result = sendViaHttpApi($config, $fromAddr, $fromName, $toAddr, $subject, $htmlBody, $alt);
                if ($result['success']) {
                    $emailMode = 'http_api_' . $apiType;
                    $emailError = '';
                    error_log('Email: HTTP API (' . $apiType . ') succeeded (submission ' . $submissionId . ')');
                    $allDebugs[] = "SUCCESS via HTTP API ($apiType)";
                } else {
                    $emailError = $result['error'] ?? 'HTTP API failed';
                    error_log('Email: HTTP API (' . $apiType . ') failed (submission ' . $submissionId . '): ' . $emailError);
                    $allErrors[] = "[http_api:$apiType] " . substr($emailError, 0, 100);
                    $allDebugs[] = "FAILED HTTP API ($apiType)\n" . $emailError;
                }
            } catch (Throwable $e) {
                $emailError = substr($e->getMessage(), 0, 200);
                error_log('Email: HTTP API exception (submission ' . $submissionId . '): ' . $emailError);
                $allErrors[] = "[http_api:$apiType] " . substr($emailError, 0, 100);
                $allDebugs[] = "FAILED HTTP API ($apiType)\n" . $emailError;
            }
        } else {
            $allDebugs[] = "HTTP API not configured (email_api_url/email_api_key missing)";
        }

        // ============================================================
        // METHOD 2: SMTP (FALLBACK) - localhost:25 Exim relay
        // ============================================================
        if ($emailMode === 'failed') {
            $smtpHost = $resolve($config, 'smtp_host') ?: 'localhost';
            $smtpUser = $resolve($config, 'smtp_user', 'smtp_username');
            $smtpPass = $resolve($config, 'smtp_pass', 'smtp_password');
            $smtpPort = (int)($resolve($config, 'smtp_port') ?: 25);
            $smtpSecure = $resolve($config, 'smtp_secure') ?: '';

            $lowerHost = strtolower((string)$smtpHost);
            $useAuth = ($smtpUser !== '' && $smtpPass !== '' && !($lowerHost === 'localhost' && $smtpPort === 25));

            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host       = $smtpHost;
                $mail->Port       = $smtpPort;
                $mail->SMTPSecure = $smtpSecure;
                $mail->SMTPAutoTLS = false;
                $mail->SMTPAuth   = $useAuth;
                if ($useAuth) {
                    $mail->Username   = $smtpUser;
                    $mail->Password   = $smtpPass;
                }
                $mail->Timeout    = 15;
                $mail->CharSet    = 'UTF-8';
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true,
                    ],
                ];

                $debugLog = '';
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
                $emailMode = 'smtp_exim';
                $emailError = '';
                error_log('Email: SMTP Exim relay succeeded (submission ' . $submissionId . ')');
                $allDebugs[] = "SUCCESS via SMTP Exim ($smtpHost:$smtpPort)\n" . $debugLog;
} catch (Throwable $e) {
                $err = $e->getMessage();
                if (isset($mail->ErrorInfo)) {
                    $err .= ' | ErrorInfo: ' . $mail->ErrorInfo;
                }
                error_log('Email SMTP Exim error (submission ' . $submissionId . '): ' . $err);
                $allErrors[] = "[smtp_exim] " . substr($err, 0, 100);
                if (!empty($debugLog)) {
                    $allDebugs[] = "FAILED SMTP Exim\n" . $debugLog;
                }
            }
        }

        // ============================================================
        // METHOD 3: SMTP Exim with NON-LOCAL envelope sender (LAST RESORT)
        // Force Exim to relay by using a non-local MAIL FROM address.
        // If envelope sender domain is NOT in local_domains, Exim may relay via MX.
        // ============================================================
        if ($emailMode === 'failed') {
            $smtpHost = $resolve($config, 'smtp_host') ?: 'localhost';
            $smtpPort = (int)($resolve($config, 'smtp_port') ?: 25);

            // Use server's hostname domain as envelope sender (likely NOT in local_domains)
            // This may force Exim to treat email as external → relay via MX (Zoho)
            $envelopeSender = 'noreply@qservers.net';  // QServers hostname domain
            // Or try: 'noreply@' . gethostname() . '.local' — but qservers.net is known

            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host       = $smtpHost;
                $mail->Port       = $smtpPort;
                $mail->SMTPSecure = '';
                $mail->SMTPAutoTLS = false;
                $mail->SMTPAuth   = false;
                $mail->Timeout    = 15;
                $mail->CharSet    = 'UTF-8';
                $mail->SMTPOptions = [
                    'ssl' => [
                        'verify_peer'       => false,
                        'verify_peer_name'  => false,
                        'allow_self_signed' => true,
                    ],
                ];

                $debugLog = '';
                $mail->SMTPDebug = 2;
                $mail->Debugoutput = function (string $str, string $level) use (&$debugLog) {
                    $debugLog .= "[$level] $str\n";
                };

                // CRITICAL: Set non-local envelope sender (MAIL FROM)
                // This may force Exim to relay via MX instead of local delivery
                $mail->Sender = $envelopeSender;

                $mail->setFrom($fromAddr, $fromName);  // From header (what user sees)
                $mail->addAddress($toAddr);
                $mail->addReplyTo($replyTo, (string)($data['name'] ?? ''));
                $mail->isHTML(true);
                $mail->Subject = $subject;
                $mail->Body    = $htmlBody;
                $mail->AltBody = $alt;

                $mail->send();
                $emailMode = 'smtp_exim_relay';
                $emailError = '';
                error_log('Email: SMTP Exim with non-local envelope sender succeeded (submission ' . $submissionId . ')');
                $allDebugs[] = "SUCCESS via SMTP Exim relay (envelope: $envelopeSender)\n" . $debugLog;
            } catch (Throwable $e) {
                $err = $e->getMessage();
                if (isset($mail->ErrorInfo)) {
                    $err .= ' | ErrorInfo: ' . $mail->ErrorInfo;
                }
                error_log('Email SMTP Exim relay failed (submission ' . $submissionId . '): ' . $err);
                $allErrors[] = "[smtp_exim_relay] " . substr($err, 0, 100);
                if (!empty($debugLog)) {
                    $allDebugs[] = "FAILED SMTP Exim relay\n" . $debugLog;
                }
            }
        }

        if ($emailMode === 'failed' && ($smtpHost === '' || $smtpPort === 0)) {
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
    'debug'   => !empty($allDebugs) ? substr(implode("\n---\n", $allDebugs), 0, 2000) : null,
]);
