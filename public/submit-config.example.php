<?php
/**
 *  * Copy to submit-config.php and fill in real values.
 * Not deployed — production uses SUBMIT_CONFIG_B64 GitHub secret.
 *
 * SMTP: QServers shared hosting blocks outbound SMTP (ports 25/465/587 to external hosts).
 * The code tries smtp.zoho.com first (PHPMailer + raw fsockopen fallback), then
 * falls back to localhost:25 (local Exim relay) which routes via DNS MX records to Zoho.
 * Requires valid smtp_user and smtp_pass for Zoho SMTP authentication.
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
    'smtp_pass'   => 'YOUR_ZOHO_EMAIL_PASSWORD',

    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',

    'allowed_origins' => [
        'https://bigfixtech.com',
        'https://www.bigfixtech.com',
    ],
];
