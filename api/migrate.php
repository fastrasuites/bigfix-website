<?php
declare(strict_types=1);

/**
 * Schema Migration Endpoint
 * POST /api/migrate.php
 *
 * Syncs the production DB schema with the codebase:
 * 1. Creates tracking tables from 003_absolute_tracking.sql if they don't exist
 * 2. Adds missing columns from 004_sync_tracking_schema.sql
 *
 * Protected by token (optional - if migration_token is set in config).
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

// Token check (if configured in submit-config.php as 'migration_token')
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
            PDO::ATTR_EMULATE_PREPARES => true,
        ]
    );

    $results = [];

    // --- Step 1: Create tables if they don't exist ---
    $migrationDir = __DIR__ . '/migrations';
    $schemaFile = $migrationDir . '/003_absolute_tracking.sql';

    // Check if tracking_sessions table exists
    $check = $pdo->query("SHOW TABLES LIKE 'tracking_sessions'");
    if (!$check->fetchColumn()) {
        // Table doesn't exist — create tables
        $createSql = "
            CREATE TABLE IF NOT EXISTS `tracking_sessions` (
                `id` CHAR(36) NOT NULL PRIMARY KEY,
                `first_seen` DATETIME DEFAULT CURRENT_TIMESTAMP,
                `last_seen` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                `page_count` INT UNSIGNED DEFAULT 1,
                `total_time` INT UNSIGNED DEFAULT 0,
                `is_converted` BOOLEAN DEFAULT FALSE,
                `converted_at` DATETIME NULL,
                `user_id` INT UNSIGNED NULL,
                `submission_id` INT UNSIGNED NULL,
                `ip_address` VARBINARY(16) NOT NULL,
                `user_agent` TEXT NOT NULL,
                `referrer` TEXT NULL,
                `utm_source` VARCHAR(100) NULL,
                `utm_medium` VARCHAR(100) NULL,
                `utm_campaign` VARCHAR(100) NULL,
                `utm_content` VARCHAR(100) NULL,
                `utm_term` VARCHAR(100) NULL,
                `landing_page` TEXT NULL,
                `country_code` CHAR(2) NULL,
                `region` VARCHAR(100) NULL,
                `city` VARCHAR(100) NULL,
                `isp` VARCHAR(100) NULL,
                `org` VARCHAR(200) NULL,
                `is_b2b` BOOLEAN DEFAULT FALSE,
                `exit_intent_captured` BOOLEAN DEFAULT FALSE,
                `exit_intent_email` VARCHAR(150) NULL,
                `exit_intent_phone` VARCHAR(30) NULL,
                `exit_intent_captured_at` DATETIME NULL,
                `identified_email` VARCHAR(255) NULL,
                `identified_phone` VARCHAR(50) NULL,
                `company_name` VARCHAR(255) NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

            CREATE TABLE IF NOT EXISTS `tracking_events` (
                `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `session_id` CHAR(36) NOT NULL,
                `submission_id` INT UNSIGNED NULL,
                `event_type` ENUM('pageview','click','scroll','form_start','form_submit','form_abandon','download','exit_intent','exit_intent_submit','exit_intent_triggered','exit_intent_converted','view_pricing','view_demo','click_whatsapp','gated_view') NOT NULL,
                `page_url` VARCHAR(1000) NOT NULL,
                `page_title` VARCHAR(300) NULL,
                `element_selector` VARCHAR(300) NULL,
                `element_text` VARCHAR(300) NULL,
                `scroll_depth` TINYINT UNSIGNED NULL,
                `time_on_page` INT UNSIGNED NULL,
                `event_data` JSON NULL,
                `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_session_created` (session_id, created_at),
                INDEX `idx_type_created` (event_type, created_at),
                INDEX `idx_submission` (submission_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ";
        foreach (explode(';', $createSql) as $stmt) {
            $stmt = trim($stmt);
            if ($stmt !== '') {
                $pdo->exec($stmt);
            }
        }
        $results[] = 'Created tracking tables (inline schema)';
    }

    // --- Step 2: Add missing columns to tracking_sessions ---
    $sessionColumns = [
        'landing_page'        => 'TEXT NULL',
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

    $colCheck = $pdo->prepare("SHOW COLUMNS FROM `tracking_sessions` LIKE ?");
    foreach ($sessionColumns as $col => $def) {
        try {
            $colCheck->execute([$col]);
            if (!$colCheck->fetch()) {
                $pdo->exec("ALTER TABLE `tracking_sessions` ADD COLUMN `$col` $def");
                $results[] = "Added column `$col` to tracking_sessions";
            }
        } catch (Throwable $e) {
            $results[] = "Skipped `$col` (already exists or error): " . $e->getMessage();
        }
    }

    // --- Step 3: Add missing columns to tracking_events ---
    $eventColumns = [
        'element_selector' => 'VARCHAR(300) NULL',
        'element_text'     => 'VARCHAR(300) NULL',
    ];

    $checkCol2 = $pdo->prepare("SHOW COLUMNS FROM `tracking_events` LIKE ?");
    foreach ($eventColumns as $col => $def) {
        try {
            $checkCol2->execute([$col]);
            if (!$checkCol2->fetch()) {
                $pdo->exec("ALTER TABLE `tracking_events` ADD COLUMN `$col` $def");
                $results[] = "Added column `$col` to tracking_events";
            }
        } catch (Throwable $e) {
            $results[] = "Skipped `$col` (already exists or error): " . $e->getMessage();
        }
    }

    // --- Step 4: Update event_type ENUM if needed ---
    $colCheck = $pdo->query("SHOW COLUMNS FROM `tracking_events` LIKE 'event_type'");
    $colInfo = $colCheck->fetch(PDO::FETCH_ASSOC);
    $currentType = $colInfo['Type'] ?? '';

    if (strpos($currentType, 'exit_intent_triggered') === false) {
        $pdo->exec("ALTER TABLE `tracking_events` MODIFY COLUMN `event_type` ENUM(
            'pageview','click','scroll','form_start','form_submit','form_abandon','download',
            'exit_intent','exit_intent_submit','exit_intent_triggered','exit_intent_converted',
            'view_pricing','view_demo','click_whatsapp','gated_view'
        ) NOT NULL");
        $results[] = 'Updated event_type ENUM on tracking_events';
    }

    // --- Step 5: Create stored procedures if they don't exist ---
    try {
        $procs = $pdo->query("SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name IN ('CleanupTrackingData', 'IdentifyTrackingSession', 'CaptureExitIntent')")->fetchAll(PDO::FETCH_ASSOC);
        $existingProcs = array_column($procs, 'Name');

        if (!in_array('IdentifyTrackingSession', $existingProcs)) {
            $pdo->exec("CREATE PROCEDURE IdentifyTrackingSession(IN p_session_id CHAR(36), IN p_user_id INT UNSIGNED, IN p_submission_id INT UNSIGNED, IN p_email VARCHAR(150), IN p_phone VARCHAR(30)) BEGIN UPDATE tracking_sessions SET is_converted=TRUE, converted_at=COALESCE(converted_at,NOW()), user_id=p_user_id, submission_id=p_submission_id, identified_email=COALESCE(p_email, identified_email), identified_phone=COALESCE(p_phone, identified_phone) WHERE id=p_session_id; UPDATE tracking_events SET user_id=p_user_id, submission_id=p_submission_id WHERE session_id=p_session_id; SELECT ROW_COUNT() AS rows_updated; END");
            $results[] = 'Created stored procedure IdentifyTrackingSession';
        }
        if (!in_array('CaptureExitIntent', $existingProcs)) {
            $pdo->exec("CREATE PROCEDURE CaptureExitIntent(IN p_session_id CHAR(36), IN p_email VARCHAR(150), IN p_phone VARCHAR(30), IN p_exit_type ENUM('mouseleave','scroll_up','back_button','blur')) BEGIN UPDATE tracking_sessions SET exit_intent_captured=TRUE, exit_intent_email=p_email, exit_intent_phone=p_phone, exit_intent_captured_at=NOW() WHERE id=p_session_id; INSERT INTO tracking_events (session_id, event_type, page_url, event_data, created_at) VALUES (p_session_id, 'exit_intent_submit', (SELECT page_url FROM tracking_events WHERE session_id=p_session_id ORDER BY created_at DESC LIMIT 1), JSON_OBJECT('email',p_email,'phone',p_phone,'exit_type',p_exit_type), NOW()); END");
            $results[] = 'Created stored procedure CaptureExitIntent';
        }
        if (!in_array('CleanupTrackingData', $existingProcs)) {
            $pdo->exec("CREATE PROCEDURE CleanupTrackingData() BEGIN DECLARE rows_deleted_events INT DEFAULT 0; DECLARE rows_deleted_sessions INT DEFAULT 0; DELETE FROM tracking_events WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY); SET rows_deleted_events = ROW_COUNT(); DELETE FROM tracking_sessions WHERE last_seen < DATE_SUB(NOW(), INTERVAL 1 YEAR) AND is_converted = FALSE; SET rows_deleted_sessions = ROW_COUNT(); SELECT CONCAT('Cleanup: ', rows_deleted_events, ' events, ', rows_deleted_sessions, ' sessions deleted') AS result; END");
            $results[] = 'Created stored procedure CleanupTrackingData';
        }
    } catch (Throwable $e) {
        $results[] = 'Stored procedure creation skipped: ' . $e->getMessage();
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
