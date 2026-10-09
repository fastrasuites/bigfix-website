<?php
/**
 * Check Zoho Mail inbox via IMAP
 */
$host = 'mail.bigfixtech.com';
$user = 'info@bigfixtech.com';
$pass = 'Alw@ysthere@43212';

// Try Zoho's IMAP directly
$servers = [
    ['server' => '{smtp.zoho.com:993/imap/ssl/novalidate-cert}', 'label' => 'smtp.zoho.com:993'],
    ['server' => '{mail.bigfixtech.com:993/imap/ssl/novalidate-cert}', 'label' => 'mail.bigfixtech.com:993'],
    ['server' => '{mail.bigfixtech.com:143}', 'label' => 'mail.bigfixtech.com:143 (no SSL)'],
    ['server' => '{localhost:143}', 'label' => 'localhost:143'],
];

foreach ($servers as $s) {
    echo "Trying " . $s['label'] . "...\n";
    $inbox = @imap_open($s['server'], $user, $pass, 3, 5);
    if ($inbox) {
        $check = imap_check($inbox);
        echo "  Connected! Messages: " . $check->Nmsgs . "\n";
        // Search for our test email
        $search = imap_search($inbox, 'SUBJECT "CHECK YOUR ZOHO INBOX ID12345"');
        if ($search) {
            echo "  Found test email! IDs: " . implode(',', $search) . "\n";
            $overview = imap_fetch_overview($inbox, implode(',', $search));
            foreach ($overview as $ov) {
                echo "  Subject: " . $ov->subject . "\n";
                echo "  From: " . $ov->from . "\n";
                echo "  Date: " . $ov->date . "\n";
            }
        } else {
            echo "  Test email NOT found in this inbox\n";
        }
        imap_close($inbox);
    } else {
        echo "  Failed: " . imap_last_error() . "\n";
    }
    echo "\n";
}
