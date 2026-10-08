<?php
/**
 * Copy this file to submit-config.php and fill in real values.
 * NEVER commit submit-config.php to git (add it to .gitignore).
 */
return [
    // Database
    'db_host' => '127.0.0.1',
    'db_name' => 'bigfix',
    'db_user' => 'bigfixte',
    'db_pass' => 'YOUR_DB_PASSWORD',

    // Email notification settings
    // Primary: Zoho SMTP (smtp.zoho.com:587, TLS) — requires app-specific password
    // Fallback: ZeptoMail REST API (https://email.zoho.com/api/v2/email) — works on shared hosts where SMTP is blocked
    // Fallback: PHP mail() — if available
    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',
    'smtp_host'   => 'smtp.zoho.com',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',
    'smtp_user'   => 'info@bigfixtech.com',
    'smtp_pass'   => 'ZOHO_APP_SPECIFIC_PASSWORD',
    'zepto_api_key' => 'ZEPTOMAIL_API_KEY_IF_SMTP_BLOCKED',

    // Sites allowed to POST to submit.php
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://bigfix.test',
        'https://bigfixtech.com',
        'https://www.bigfixtech.com',
    ],

    // Dashboard login
    'dash_user'      => 'admin',
    'dash_pass_hash' => 'PASTE_NEW_HASH_HERE',
];
