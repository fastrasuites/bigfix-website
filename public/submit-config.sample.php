<?php
/**
 * BigFix Submit Handler Configuration (Sample)
 *
 * Copy this file to submit-config.php and fill in your real credentials.
 * submit-config.php is git-ignored and should NEVER be committed to the repository.
 */

return [
    // --- Database (cPanel MySQL) ---
    'db_host'     => 'localhost',
    'db_name'     => 'your_database_name',
    'db_user'     => 'your_database_user',
    'db_pass'     => 'your_database_password',

    // --- Email Notification ---
    'to_email'    => 'info@bigfixtech.com',
    'from_name'   => 'BigFix',
    'smtp_user'   => 'info@bigfixtech.com', // used in From header
];
