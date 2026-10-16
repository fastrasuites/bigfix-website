<?php
declare(strict_types=1);

/**
 * Schema Migration Endpoint
 * POST /api/migrate.php
 * 
 * Adds missing columns to tracking_sessions and tracking_events tables
 * to synchronize the production DB with the codebase schema.
 * 
 * Protected by a token passed via X-Migration-Token header (from config).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Migration-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Load config
$configFile = __DIR__ . '/../submit-config.php';
if (!is_file($configFile)) {
    $configFile = __DIR__ . '/submit-config.php';
}
$config = is_file($configFile) ? require $configFile : [
    'db_host' => '127.0.0.1',
    'db_name' => 'bigfixte_submissions',
    'db_user' => 'bigfixte_sub_user',
    'db_pass' => '}aM(lPXbzhSYd*A?',
];

// Token check (optional - if configured)
$migrationToken = $config['migration_token'] ?? '';
$providedToken = $_SERVER['HTTP_X_MIGRATION_TOKEN'] ?? '';
if ($migrationToken !== '' && $providedToken !== $migrationToken) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

try {
    $pdo = new PDO(
        "mysql:host={$config['db_host']};dbname={$config['db_name']};charset=utf8mb4",
        $config['db_user'],
        $config['db_pass'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    $results = [];

    // --- tracking_sessions: add missing columns ---
    $sessionColumns = [
        'landing_page'        => 'TEXT NULL AFTER `utm_term`',
        'ip_address_str'      => 'VARCHAR(45) GENERATED ALWAYS AS (INET6_NTOA(`ip_address`)) STORED',
        'device_type'         => "ENUM('desktop','mobile','tablet','bot') DEFAULT 'desktop'",
        'device_brand'        => 'VARCHAR(100) NULL',
        'device_model'        => 'VARCHAR(100) NULL',
        'os_name'             => 'VARCHAR(100) NULL',
        'os_version'          => 'VARCHAR(50) NULL',
        'browser_name'        => 'VARCHAR(100) NULL',
        'browser_version'     => 'VARCHAR(50) NULL',
        'latitude'            => 'DECIMAL(10,8) NULL',
        'longitude'           => 'DECIMAL(11,8) NULL',
        'company_name'        => 'VARCHAR(255) NULL',
        'identified_email'    => 'VARCHAR(255) NULL',
        'identified_phone'    => 'VARCHAR(50) NULL',
        'b2b_confidence'      => 'TINYINT DEFAULT 0',
    ];

    foreach ($sessionColumns as $col => $def) {
        $check = $pdo->prepare("SHOW COLUMNS FROM `tracking_sessions` LIKE ?");
        $check->execute([$col]);
        if (!$check->fetch()) {
            $pdo->exec("ALTER TABLE `tracking_sessions` ADD COLUMN `$col` $def");
            $results[] = "Added column `$col` to tracking_sessions";
        }
    }

    // --- tracking_events: add missing columns ---
    $eventColumns = [
        'element_selector' => 'VARCHAR(300) NULL AFTER `page_title`',
        'element_text'     => 'VARCHAR(300) NULL AFTER `element_selector`',
    ];

    foreach ($eventColumns as $col => $def) {
        $check = $pdo->prepare("SHOW COLUMNS FROM `tracking_events` LIKE ?");
        $check->execute([$col]);
        if (!$check->fetch()) {
            $pdo->exec("ALTER TABLE `tracking_events` ADD COLUMN `$col` $def");
            $results[] = "Added column `$col` to tracking_events";
        }
    }

    // --- Update events_enum to include all event types ---
    $fullEnum = "'pageview','click','scroll','form_start','form_submit','form_abandon','download','exit_intent','exit_intent_submit','exit_intent_triggered','exit_intent_converted','view_pricing','view_demo','click_whatsapp','gated_view'";

    $check = $pdo->query("SHOW COLUMNS FROM `tracking_events` LIKE 'event_type'");
    $colInfo = $check->fetch(PDO::FETCH_ASSOC);
    $currentType = $colInfo['Type'] ?? '';

    // Compare current ENUM values with expected
    preg_match("/^enum\((.*)\)$/i", $currentType, $matches);
    $currentValues = $matches[1] ?? '';

    if (!str_contains($currentValues, 'exit_intent_triggered')) {
        $pdo->exec("ALTER TABLE `tracking_events` MODIFY COLUMN `event_type` ENUM($fullEnum) NOT NULL");
        $results[] = "Updated event_type ENUM on tracking_events";
    }

    echo json_encode([
        'success' => true,
        'migrations_run' => count($results),
        'details' => $results,
    ]);

} catch (Throwable $e) {
    error_log('Migration error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'migrations_run' => 0,
        'details' => [],
    ]);
}
