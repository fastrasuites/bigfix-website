<?php
// Test: simulate exact init.php POST flow
error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "1. Script started\n";
echo "PHP version: " . PHP_VERSION . "\n";

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

// Test UUID generation
echo "7a. random_bytes exists: " . (function_exists('random_bytes') ? 'yes' : 'no') . "\n";
echo "7b. random_int exists: " . (function_exists('random_int') ? 'yes' : 'no') . "\n";
echo "7c. mt_rand exists: " . (function_exists('mt_rand') ? 'yes' : 'no') . "\n";
if (function_exists('random_bytes')) {
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
    echo "7d. UUID generated: $uuid (len=" . strlen($uuid) . ")\n";
} else {
    echo "7d. random_bytes NOT available\n";
}

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
