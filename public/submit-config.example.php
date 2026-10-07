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

    // Email via Zoho SMTP
    'smtp_host'   => 'smtp.zoho.com',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',
    'smtp_user'   => 'info@bigfixtech.com',
    'smtp_pass'   => 'YOUR_SMTP_PASSWORD',
    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',

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
