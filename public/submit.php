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
 * Send email notification using SMTP (no external dependencies)
 */
function sendEmailViaSMTP($config, $subject, $htmlBody) {
    $to = $config['to_email'];
    $from_email = $config['smtp_user'];
    $from_name = $config['from_name'];
    $smtp_pass = $config['smtp_pass'];
    $smtp_host = $config['smtp_host'] ?? 'mail.bigfixtech.com';
    $smtp_port = $config['smtp_port'] ?? 465;
    $smtp_encryption = $config['smtp_encryption'] ?? 'ssl';

    $message = "MIME-Version: 1.0\r\n";
    $message .= "From: {$from_name} <{$from_email}>\r\n";
    $message .= "Reply-To: {$to}\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Subject: " . mb_encode_mimeheader($subject, 'UTF-8', 'B') . "\r\n";
    $message .= "To: {$to}\r\n\r\n";
    $message .= $htmlBody;

    $boundary = md5(uniqid(time()));
    $multipart = "MIME-Version: 1.0\r\n";
    $multipart .= "From: {$from_name} <{$from_email}>\r\n";
    $multipart .= "To: {$to}\r\n";
    $multipart .= "Subject: " . mb_encode_mimeheader($subject, 'UTF-8', 'B') . "\r\n";
    $multipart .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n\r\n";
    $multipart .= "--" . $boundary . "\r\n";
    $multipart .= "Content-Type: text/html; charset=UTF-8\r\n";
    $multipart .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $multipart .= $htmlBody . "\r\n";
    $multipart .= "--" . $boundary . "--\r\n";

    $log_entry = date('Y-m-d H:i:s') . " - SMTP attempt to: {$to} from: {$from_email} host: {$smtp_host}:{$smtp_port} enc: {$smtp_encryption}\n";
    file_put_contents(__DIR__ . '/submit-debug.log', $log_entry, FILE_APPEND | LOCK_EX);

    $errno = 0;
    $errstr = '';
    
    // Try multiple connection methods
    $connection_success = false;
    $socket = null;
    
    // Method 1: Try ssl:// for port 465
    if ($smtp_encryption === 'ssl' || $smtp_port == 465) {
        $socket = @fsockopen("ssl://{$smtp_host}", $smtp_port, $errno, $errstr, 10);
        if (!$socket) {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen ssl:// failed: {$errstr} ({$errno})\n", FILE_APPEND | LOCK_EX);
            // Try without ssl:// prefix (plain connection)
            $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 10);
            if ($socket) {
                file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen plain succeeded (port {$smtp_port})\n", FILE_APPEND | LOCK_EX);
                // For plain connection on 465, we might need STARTTLS
            }
        } else {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen ssl:// succeeded\n", FILE_APPEND | LOCK_EX);
            $connection_success = true;
        }
    }
    
    // Method 2: Try tls:// for port 587
    if (!$connection_success && ($smtp_port == 587 || $smtp_encryption === 'tls')) {
        $socket = @fsockopen("tls://{$smtp_host}", $smtp_port, $errno, $errstr, 10);
        if (!$socket) {
            $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 10);
        }
        if ($socket) {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen tls/plain succeeded (port {$smtp_port})\n", FILE_APPEND | LOCK_EX);
            $connection_success = true;
        } else {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen tls failed: {$errstr} ({$errno})\n", FILE_APPEND | LOCK_EX);
        }
    }
    
    // Method 3: Try plain connection on port 25 or 587
    if (!$connection_success) {
        $socket = @fsockopen($smtp_host, 587, $errno, $errstr, 10);
        if (!$socket) {
            $socket = @fsockopen($smtp_host, 25, $errno, $errstr, 10);
        }
        if ($socket) {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen plain succeeded on port 587/25\n", FILE_APPEND | LOCK_EX);
            $connection_success = true;
        } else {
            file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - fsockopen all methods FAILED: {$errstr} ({$errno})\n", FILE_APPEND | LOCK_EX);
        }
    }

    if (!$socket) {
        // Ultimate fallback: try mail() with additional headers
        $headers = [
            "From: {$from_name} <{$from_email}>",
            "Reply-To: {$to}",
            "Content-Type: text/html; charset=UTF-8",
            "X-Mailer: PHP/" . phpversion(),
        ];

        $result = @mail($to, $subject, $htmlBody, implode("\r\n", $headers));
        file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - mail() fallback: " . ($result ? "SUCCESS" : "FAILED") . "\n", FILE_APPEND | LOCK_EX);
        return $result;
    }

    stream_set_timeout($socket, 30);

    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Server greeting: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    // SMTP conversation
    fwrite($socket, "EHLO {$smtp_host}\r\n");
    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - EHLO response: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    fwrite($socket, "AUTH LOGIN\r\n");
    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - AUTH LOGIN response: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    $encoded_user = base64_encode($from_email);
    fwrite($socket, $encoded_user . "\r\n");
    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Username response: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    $encoded_pass = base64_encode($smtp_pass);
    fwrite($socket, $encoded_pass . "\r\n");
    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - Password response: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    if (strpos($response, "235") !== 0) {
        fclose($socket);
        file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - SMTP AUTH FAILED\n", FILE_APPEND | LOCK_EX);
        return false;
    }

    fwrite($socket, "MAIL FROM: <{$from_email}>\r\n");
    $response = fgets($socket, 515);

    fwrite($socket, "RCPT TO: <{$to}>\r\n");
    $response = fgets($socket, 515);

    fwrite($socket, "DATA\r\n");
    $response = fgets($socket, 515);

    fwrite($socket, $multipart);
    fwrite($socket, "\r\n.\r\n");
    $response = fgets($socket, 515);
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - DATA response: " . trim($response) . "\n", FILE_APPEND | LOCK_EX);

    fwrite($socket, "QUIT\r\n");
    fclose($socket);

    $success = strpos($response, "250") !== false;
    file_put_contents(__DIR__ . '/submit-debug.log', date('Y-m-d H:i:s') . " - SMTP result: " . ($success ? "SUCCESS" : "FAILED") . "\n", FILE_APPEND | LOCK_EX);

    return $success;
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
