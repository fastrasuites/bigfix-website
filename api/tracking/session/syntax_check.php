<?php
// Test: just try to parse init.php without executing it
error_reporting(E_ALL);
ini_set('display_errors', '1');
echo "Starting lint check...\n";

// This will check if init.php has syntax errors
$output = [];
exec("php -l " . escapeshellarg(dirname(__FILE__) . '/init.php') . " 2>&1", $output, $returnCode);
echo "Return code: $returnCode\n";
echo "Output: " . implode("\n", $output) . "\n";

// Also check lib files
foreach (['IpEnricher.php', 'DeviceDetector.php', 'TrackingService.php'] as $lib) {
    $path = dirname(__FILE__) . '/../../lib/' . $lib;
    exec("php -l " . escapeshellarg($path) . " 2>&1", $output, $returnCode);
    echo "$lib - Return code: $returnCode, Output: " . implode("\n", $output) . "\n";
}

echo "\nDone.\n";
