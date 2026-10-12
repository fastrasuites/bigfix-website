<?php
echo "PHP Version: " . PHP_VERSION . "\n";
error_reporting(E_ALL);
ini_set('display_errors', '1');

// Test config
$configFile = __DIR__ . '/../../../submit-config.php';
echo "Config file path: $configFile\n";
echo "Config exists: " . (is_file($configFile) ? 'YES' : 'NO') . "\n";

if (is_file($configFile)) {
    $config = require $configFile;
    echo "Config loaded: " . (isset($config['db_host']) ? 'YES' : 'NO') . "\n";
    echo "DB Host: " . $config['db_host'] . "\n";
    echo "DB Name: " . $config['db_name'] . "\n";
}

// Test require_once
echo "\n--- Testing require_once ---\n";
try {
    require_once __DIR__ . '/../../lib/IpEnricher.php';
    echo "IpEnricher loaded: YES\n";
} catch (\Throwable $e) {
    echo "IpEnricher error: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/../../lib/DeviceDetector.php';
    echo "DeviceDetector loaded: YES\n";
} catch (\Throwable $e) {
    echo "DeviceDetector error: " . $e->getMessage() . "\n";
}

echo "\nPHP error check done.\n";
