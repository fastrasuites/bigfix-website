<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$configFile = '/home/bigfixte/public_html/submit-config.php';
$config = require $configFile;

echo "Step 1: Config loaded\n";

require_once '/home/bigfixte/public_html/api/lib/IpEnricher.php';
require_once '/home/bigfixte/public_html/api/lib/DeviceDetector.php';
require_once '/home/bigfixte/public_html/api/lib/TrackingService.php';

echo "Step 2: Libs loaded\n";

use BigFix\Tracking\IpEnricher;
use BigFix\Tracking\DeviceDetector;

echo "Step 3: Classes imported\n";

// Test IP enricher
$ipEnricher = new IpEnricher();
echo "Step 4: IpEnricher instantiated\n";

$ipData = $ipEnricher->enrich('8.8.8.8');
echo "Step 5: IP enriched - " . json_encode($ipData) . "\n";

// Test Device detector
$deviceDetector = new DeviceDetector();
echo "Step 6: DeviceDetector instantiated\n";

$deviceData = $deviceDetector->detect('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
echo "Step 7: Device detected - " . json_encode($deviceData) . "\n";

// Test UUID generation
function generateUUIDv4(): string {
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$sessionId = generateUUIDv4();
echo "Step 8: UUID generated - $sessionId\n";

// Test DB insert
$pdo = new PDO(
    "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
    $config['db_user'],
    $config['db_pass'],
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
);

echo "Step 9: DB connected\n";

// Test simple insert
$stmt = $pdo->prepare("INSERT INTO tracking_sessions (id, ip_address, user_agent, device_type) VALUES (?, INET6_ATON(?), ?, ?)");
$stmt->execute([$sessionId, '8.8.8.8', 'test', 'desktop']);
echo "Step 10: Insert successful\n";

echo "\nAll tests passed!\n";
