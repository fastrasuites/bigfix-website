<?php
$records = @dns_get_record('bigfixtech.com', DNS_MX | DNS_TXT);
echo "=== MX Records ===\n";
$mx = dns_get_record('bigfixtech.com', DNS_MX);
foreach ($mx as $r) {
    echo "  Priority {$r['pri']}: {$r['target']}\n";
}

echo "\n=== TXT Records ===\n";
$txt = dns_get_record('bigfixtech.com', DNS_TXT);
foreach ($txt as $r) {
    echo "  " . json_encode($r['txt']) . "\n";
}

echo "\n=== SPF ===\n";
$spf = dns_get_record('bigfixtech.com', DNS_TXT);
foreach ($spf as $r) {
    if (is_array($r['txt'])) {
        foreach ($r['txt'] as $t) {
            if (str_starts_with($t, 'v=spf1') || str_contains($t, 'v=spf1')) {
                echo "  SPF: " . $t . "\n";
            }
        }
    } elseif (str_contains($r['txt'], 'v=spf1')) {
        echo "  SPF: " . $r['txt'] . "\n";
    }
}

echo "\n=== Checking mail.bigfixtech.com ===\n";
echo "IP: " . gethostbyname('mail.bigfixtech.com') . "\n";

echo "\n=== Checking smtp.zoho.com ===\n";
echo "IP: " . gethostbyname('smtp.zoho.com') . "\n";

// Check if bigfixtech.com MX points to Zoho or cPanel
echo "\n=== Is Zoho the MX? ===\n";
$mailsToZoho = false;
foreach ($mx as $r) {
    if (str_contains(strtolower($r['target']), 'zoho')) {
        $mailsToZoho = true;
        break;
    }
}
echo $mailsToZoho ? "YES - MX points to Zoho\n" : "NO - MX does NOT point to Zoho (goes to cPanel/local Exim)\n";
