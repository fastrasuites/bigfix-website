<?php
/**
 * Form submission endpoint for BigFix landing page.
 * Receives POST requests from the React forms, validates input,
 * stores in MySQL, and sends an email notification via PHP mail().
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load configuration
$configFile = __DIR__ . '/submit-config.php';
if (!file_exists($configFile)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Configuration file missing']);
    exit;
}

$config = require $configFile;

// Set sendmail_from for PHP mail() to work on some hosts
ini_set('sendmail_from', $config['smtp_user']);

// Decode JSON input (sent by fetch API)
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);

if (!$input) {
    $input = $_POST;
}

/**
 * Sanitize input data
 */
function sanitize($data) {
    if (is_array($data)) {
        return array_map('sanitize', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

/**
 * Validate email format
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone format (Nigerian numbers)
 */
function isValidPhone($phone) {
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    return strlen($phone) >= 10;
}

/**
 * Send email notification using Resend API
 */
function sendEmailNotification($config, $subject, $htmlBody, $altBody) {
    $to = $config['to_email'];
    $from = $config['resend_from'] ?? 'onboarding@resend.dev';
    $apiKey = $config['resend_api_key'] ?? '';

    if (empty($apiKey)) {
        file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Resend API key missing\n", FILE_APPEND | LOCK_EX);
        return false;
    }

    $payload = json_encode([
        'from' => $from,
        'to' => [$to],
        'subject' => $subject,
        'html' => $htmlBody,
    ]);

    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Resend API attempt to: {$to}\n", FILE_APPEND | LOCK_EX);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.resend.com/emails');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json',
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Resend response: HTTP {$httpCode} - {$response}\n", FILE_APPEND | LOCK_EX);

    if ($error) {
        file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Resend curl error: {$error}\n", FILE_APPEND | LOCK_EX);
        return false;
    }

    if ($httpCode >= 200 && $httpCode < 300) {
        return true;
    }

    return false;
}

/**
 * Send email notification using PHP's built-in mail() function
 */
function sendEmailNotification($config, $subject, $htmlBody, $altBody) {
    // Try SMTP first, fallback to mail()
    $result = sendEmailViaSMTP($config, $subject, $htmlBody);
    
    if (!$result) {
        error_log("SMTP and mail() both FAILED for submission notification to {$config['to_email']}");
    } else {
        error_log("Email sent successfully to {$config['to_email']}");
    }
    
    return $result;
}

$data = sanitize($input);

// Validate required fields based on source
$source = $data['source'] ?? 'unknown';
$errors = [];

// Common required fields
if (empty($data['name'])) {
    $errors[] = 'Name is required';
}

if (empty($data['email']) || !isValidEmail($data['email'])) {
    $errors[] = 'Valid email is required';
}

// Source-specific validation
switch ($source) {
    case 'contact':
        if (empty($data['subject'])) {
            $errors[] = 'Subject is required';
        }
        if (empty($data['message'])) {
            $errors[] = 'Message is required';
        }
        break;

    case 'book_demo':
        if (empty($data['company'])) {
            $errors[] = 'Company name is required';
        }
        if (empty($data['phone']) || !isValidPhone($data['phone'])) {
            $errors[] = 'Valid phone number is required';
        }
        if (empty($data['date'])) {
            $errors[] = 'Date is required';
        }
        if (empty($data['time'])) {
            $errors[] = 'Time is required';
        }
        break;

    case 'home_review':
        if (empty($data['company'])) {
            $errors[] = 'Company name is required';
        }
        if (empty($data['product'])) {
            $errors[] = 'Product of interest is required';
        }
        break;
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation errors',
        'errors' => $errors
    ]);
    exit;
}

// Database storage
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=latin1",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare("
        INSERT INTO submissions
            (source, name, email, phone, subject, message, company, product, industry, users, date, time, notes, created_at)
        VALUES
            (:source, :name, :email, :phone, :subject, :message, :company, :product, :industry, :users, :date, :time, :notes, NOW())
    ");

    $stmt->execute([
        'source'    => $source,
        'name'      => $data['name'] ?? null,
        'email'     => $data['email'] ?? null,
        'phone'     => $data['phone'] ?? null,
        'subject'   => $data['subject'] ?? null,
        'message'   => $data['message'] ?? null,
        'company'   => $data['company'] ?? null,
        'product'   => $data['product'] ?? null,
        'industry'  => $data['industry'] ?? null,
        'users'     => $data['users'] ?? null,
        'date'      => $data['date'] ?? null,
        'time'      => $data['time'] ?? null,
        'notes'     => $data['notes'] ?? null,
    ]);

    $submissionId = $pdo->lastInsertId();
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    exit;
}

// Email notification
try {
    $mailSubject = "New Form Submission: " . ucfirst($source) . " (ID: " . $submissionId . ")";

    $htmlBody = "<h2>New BigFix Form Submission</h2>";
    $htmlBody .= "<p><strong>Source:</strong> " . htmlspecialchars($source, ENT_QUOTES, 'UTF-8') . "</p>";
    $htmlBody .= "<p><strong>Submission ID:</strong> " . $submissionId . "</p>";
    $htmlBody .= "<hr>";

    $formFields = ['name', 'email', 'phone', 'subject', 'company', 'product', 'industry', 'users', 'date', 'time'];
    foreach ($formFields as $field) {
        if (!empty($data[$field])) {
            $htmlBody .= "<p><strong>" . ucfirst($field) . ":</strong> " . htmlspecialchars($data[$field], ENT_QUOTES, 'UTF-8') . "</p>";
        }
    }

    if (!empty($data['message'])) {
        $htmlBody .= "<p><strong>Message:</strong></p><p>" . nl2br(htmlspecialchars($data['message'], ENT_QUOTES, 'UTF-8')) . "</p>";
    }

    if (!empty($data['notes'])) {
        $htmlBody .= "<p><strong>Notes:</strong></p><p>" . nl2br(htmlspecialchars($data['notes'], ENT_QUOTES, 'UTF-8')) . "</p>";
    }

    $htmlBody .= "<hr><p>Submitted on: " . date('Y-m-d H:i:s') . "</p>";

    $altBody = strip_tags($htmlBody);

    sendEmailNotification($config, $mailSubject, $htmlBody, $altBody);
} catch (Exception $e) {
    error_log("Email error: " . $e->getMessage());
    // Email failure shouldn't block the success response
}

http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Submission received successfully',
    'id' => $submissionId
]);
