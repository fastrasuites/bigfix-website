<?php
/**
 * Copy to submit-config.php and fill in real values.
 * Not deployed — production uses SUBMIT_CONFIG_B64 GitHub secret.
 *
 * SMTP: Use smtp.zoho.com (NOT mail.bigfixtech.com).
 * mail.bigfixtech.com resolves to the shared host's local Exim which
 * rejects Zoho Mail credentials with "535 Incorrect authentication data".
 * smtp.zoho.com connects directly to Zoho's SMTP servers.
 */
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'bigfixte_submissions',
    'db_user' => 'bigfixte_sub_user',
    'db_pass' => 'YOUR_DB_PASSWORD',

    'smtp_host'   => 'smtp.zoho.com',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',
    'smtp_user'   => 'info@bigfixtech.com',
    'smtp_pass'   => 'YOUR_ZOHO_MAIL_PASSWORD',

    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',

    'allowed_origins' => [
        'https://bigfixtech.com',
        'https://www.bigfixtech.com',
        'http://localhost:5173',
    ],
];
