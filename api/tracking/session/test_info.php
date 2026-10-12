<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$configFile = '/home/bigfixte/public_html/submit-config.php';
$config = require $configFile;

echo "Config loaded\n";

// Test DB connection
try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "DB connected: YES\n";
    
    // Test if table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'tracking_sessions'");
    $tableExists = $stmt->fetchColumn();
    echo "tracking_sessions table: " . ($tableExists ? 'EXISTS' : 'MISSING') . "\n";
    
    // Test INET6_ATON function (used in init.php)
    $stmt = $pdo->query("SELECT INET6_ATON('127.0.0.1')");
    $result = $stmt->fetchColumn();
    echo "INET6_ATON works: " . ($result !== false ? 'YES' : 'NO') . "\n";
    
} catch (\Throwable $e) {
    echo "DB error: " . $e->getMessage() . "\n";
}

// Test MaxMind DB
$mmdbPath = '/home/bigfixte/public_html/api/data/GeoLite2-City.mmdb';
echo "MaxMind DB exists: " . (file_exists($mmdbPath) ? 'YES' : 'NO') . "\n";

// Test cache dir
$cacheDir = '/home/bigfixte/public_html/api/cache/';
echo "Cache dir exists: " . (is_dir($cacheDir) ? 'YES' : 'NO') . "\n";
echo "Cache dir writable: " . (is_writable($cacheDir) ? 'YES' : 'NO') . "\n";

echo "\nDone.\n";
