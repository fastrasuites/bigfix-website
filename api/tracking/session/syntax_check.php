<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "=== Step 1: Load config ===\n";
$configFile = __DIR__ . '/../../../submit-config.php';
$config = require $configFile;
echo "Config loaded OK\n";

echo "\n=== Step 2: Load libs ===\n";
require_once __DIR__ . '/../../lib/IpEnricher.php';
require_once __DIR__ . '/../../lib/DeviceDetector.php';
require_once __DIR__ . '/../../lib/TrackingService.php';
echo "Libs loaded OK\n";

echo "\n=== Step 3: Instantiate classes ===\n";
$ipEnricher = new \BigFix\Tracking\IpEnricher();
echo "IpEnricher OK\n";
$deviceDetector = new \BigFix\Tracking\DeviceDetector();
echo "DeviceDetector OK\n";

echo "\n=== Step 4: Test enrich ===\n";
$result = $ipEnricher->enrich('8.8.8.8');
echo "Enrich result: " . json_encode($result) . "\n";

echo "\n=== Step 5: Test detect ===\n";
$result = $deviceDetector->detect('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
echo "Detect result: " . json_encode($result) . "\n";

echo "\n=== Step 6: Test DB ===\n";
$pdo = new PDO(
    "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
    $config['db_user'],
    $config['db_pass'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);
echo "DB connected OK\n";

echo "\n=== All tests passed! ===\n";
