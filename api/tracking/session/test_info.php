<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "=== Debug Info ===\n";
echo "PHP Version: " . PHP_VERSION . "\n";

$configFile = __DIR__ . '/../../../submit-config.php';
echo "Config path: $configFile\n";
echo "Config exists: " . (is_file($configFile) ? 'YES' : 'NO') . "\n";

if (is_file($configFile)) {
    echo "Config readable: " . (is_readable($configFile) ? 'YES' : 'NO') . "\n";
    $config = require $configFile;
    echo "Config keys: " . implode(', ', array_keys($config)) . "\n";
}

echo "\n=== Testing require_once ---\n";
try {
    require_once __DIR__ . '/../../lib/IpEnricher.php';
    echo "IpEnricher: OK\n";
} catch (\Throwable $e) {
    echo "IpEnricher ERROR: " . $e->getMessage() . "\n";
}

try {
    require_once __DIR__ . '/../../lib/DeviceDetector.php';
    echo "DeviceDetector: OK\n";
} catch (\Throwable $e) {
    echo "DeviceDetector ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== Testing class instantiation ---\n";
try {
    $ip = new \BigFix\Tracking\IpEnricher();
    echo "IpEnricher instance: OK\n";
} catch (\Throwable $e) {
    echo "IpEnricher instance ERROR: " . $e->getMessage() . "\n";
}

try {
    $dev = new \BigFix\Tracking\DeviceDetector();
    echo "DeviceDetector instance: OK\n";
} catch (\Throwable $e) {
    echo "DeviceDetector instance ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== Done ===\n";
