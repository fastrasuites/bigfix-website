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

function respond(int $code, array $body): never
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
function clean(mixed $v, int $max, bool $multiline = false): ?string
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

    $subject = 'New Form Submission: ' . ucfirst(str_replace('_', ' ', $source)) . ' (ID: ' . $submissionId . ')';

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $secure = (string)($config['smtp_secure'] ?? '');
    $user   = (string)($config['smtp_user'] ?? '');
    $mail->SMTPAuth   = $user !== '';              // no login for local catchers like Mailpit
    $mail->Username   = $user;
    $mail->Password   = (string)($config['smtp_pass'] ?? '');
    $mail->SMTPSecure = $secure;                   // '', 'ssl' or 'tls'
    $mail->SMTPAutoTLS = $secure !== '';           // plain SMTP when no encryption is configured
    $mail->Port       = (int)$config['smtp_port'];
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 10;

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($data['email'], $data['name'] ?? '');   // email already validated

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = trim(strip_tags(str_replace(['</p>', '<hr>'], "\n", $htmlBody)));
    $mail->send();
} catch (Throwable $e) {
    error_log('Email error: ' . $e->getMessage());
}

respond(200, [
    'success' => true,
    'message' => 'Submission received successfully',
    'id'      => $submissionId,
]);