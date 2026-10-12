<?php
echo "PHP Version: " . PHP_VERSION . "\n";
echo "__DIR__: " . __DIR__ . "\n";
$configPath = __DIR__ . '/../../../submit-config.php';
echo "Config path: " . $configPath . "\n";
echo "Config exists: " . (is_file($configPath) ? 'YES' : 'NO') . "\n";
echo "IpEnricher path: " . __DIR__ . '/../../lib/IpEnricher.php' . "\n";
echo "IpEnricher exists: " . (is_file(__DIR__ . '/../../lib/IpEnricher.php') ? 'YES' : 'NO') . "\n";
echo "PDO available: " . (class_exists('PDO') ? 'YES' : 'NO') . "\n";
echo "pdo_mysql: " . (extension_loaded('pdo_mysql') ? 'YES' : 'NO') . "\n";
echo "MaxMind Reader: " . (class_exists('MaxMind\\Db\\Reader') ? 'YES' : 'NO') . "\n";
