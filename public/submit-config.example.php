<?php
/**
 * Copy to submit-config.php and fill in real values.
 * Not deployed — production uses SUBMIT_CONFIG_B64 GitHub secret.
 *
 * SMTP: QServers blocks outbound SMTP (ports 25/465/587 to external hosts).
 * Use localhost:25 (local Exim relay) — it routes via DNS MX records to Zoho.
 * In cPanel: Email → Email Routing → set to "Remote Mail Exchanger" so
 * local Exim relays to Zoho's MX servers instead of delivering locally.
 */
return [
    'db_host' => '127.0.0.1',
    'db_name' => 'bigfixte_submissions',
    'db_user' => 'bigfixte_sub_user',
    'db_pass' => 'YOUR_DB_PASSWORD',

    'smtp_host'   => 'localhost',
    'smtp_port'   => 25,
    'smtp_secure' => '',
    'smtp_user'   => '',
    'smtp_pass'   => '',

    'from_email'  => 'info@bigfixtech.com',
    'from_name'   => 'BigFix Website',
    'to_email'    => 'info@bigfixtech.com',

    'allowed_origins' => [
        'https://bigfixtech.com',
        'https://www.bigfixtech.com',
    ],
];
