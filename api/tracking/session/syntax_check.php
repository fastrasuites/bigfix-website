<?php
// Test: simulate exact init.php POST flow
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "1. Script started\n";

// Simulate POST handling
$_SERVER['REQUEST_METHOD'] = 'POST';
$_SERVER['HTTP_HOST'] = 'bigfixtech.com';

echo "2. Before config check\n";

$configFile = __DIR__ . '/../../../submit-config.php';
if (!is_file($configFile)) {
    $configFile = __DIR__ . '/../../../../submit-config.php';
}

if (!is_file($configFile)) {
    echo "3. Config file NOT found at any path!\n";
    exit;
}

echo "3. Config file found: $configFile\n";

$config = require $configFile;
echo "4. Config loaded\n";

// Now test the actual init.php logic
require_once __DIR__ . '/../../lib/IpEnricher.php';
require_once __DIR__ . '/../../lib/DeviceDetector.php';
require_once __DIR__ . '/../../lib/TrackingService.php';
echo "5. Libs loaded\n";

$ipEnricher = new \BigFix\Tracking\IpEnricher();
$deviceDetector = new \BigFix\Tracking\DeviceDetector();
echo "6. Classes instantiated\n";

// Test the enrich call with localhost
$ipData = $ipEnricher->enrich('127.0.0.1');
echo "7. IP enrich done\n";

// Now test the actual POST body parsing (simulating browser request)
$raw = json_encode(['landing_page' => 'https://bigfixtech.com/', 'user_agent' => 'Mozilla/5.0']);
$input = json_decode($raw, true);
echo "8. Input parsed: " . json_encode($input) . "\n";

// Try database insert
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "9. DB connected\n";

    // Test the CREATE TABLE migration
    $migrationFile = __DIR__ . '/../../migrations/003_absolute_tracking.sql';
    $migrationSql = file_get_contents($migrationFile);
    echo "10. Migration file loaded\n";

    // Test INET6_ATON
    $stmt = $pdo->prepare('SELECT INET6_ATON(?)');
    $stmt->execute(['127.0.0.1']);
    $result = $stmt->fetchColumn();
    echo "11. INET6_ATON works: $result\n";

} catch (\Throwable $e) {
    echo "12. Error: " . $e->getMessage() . "\n";
    echo "13. File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n=== Test Complete ===\n";
