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
 * Send email notification using PHP's built-in mail() function
 */
function sendEmailNotification($config, $subject, $htmlBody, $altBody) {
    $headers = [];
    $headers[] = "From: " . $config['from_name'] . " <" . $config['smtp_user'] . ">";
    $headers[] = "Reply-To: " . $config['to_email'];
    $headers[] = "Content-Type: text/html; charset=UTF-8";
    $headers[] = "X-Mailer: PHP/" . phpversion();

    $result = mail($config['to_email'], $subject, $htmlBody, implode("\r\n", $headers));
    
    if (!$result) {
        error_log("PHP mail() failed for submission notification");
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
