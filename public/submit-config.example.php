<?php
/**
 * Copy this file to submit-config.php and fill in real values.
 * NEVER commit submit-config.php to git (it is in .gitignore).
 */
return [
    // Database
    'db_host' => '127.0.0.1',
    'db_name' => 'bigfixte_submissions',
    'db_user' => 'bigfixte_sub_user',
    'db_pass' => 'YOUR_DB_PASSWORD',

    // Zoho Mail SMTP (required)
    // Get an app-specific password from Zoho: My Account → Security → App Passwords
    'smtp_host'   => 'smtp.zoho.com',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',
    'smtp_user'   => 'info@bigfixtech.com',
    'smtp_pass'   => 'ZOHO_APP_SPECIFIC_PASSWORD',
    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',

    // Sites allowed to POST to submit.php
    'allowed_origins' => [
        'https://bigfixtech.com',
        'https://www.bigfixtech.com',
    ],

    // Dashboard login
    'dash_user'      => 'admin',
    'dash_pass_hash' => 'PASTE_HASH_HERE',
];
