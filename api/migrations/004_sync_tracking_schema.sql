-- ============================================================
-- Migration 004: Sync tracking schema with codebase
-- Run after init.php, events.php, and identify.php are deployed.
-- Idempotent: checks column existence before adding.
-- ============================================================

-- Add missing columns to tracking_sessions
SET @cols := (SELECT IFNULL(GROUP_CONCAT(COLUMN_NAME), '') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracking_sessions');

SET @sql = '';

-- landing_page
SET @sql = IF(FIND_IN_SET('landing_page', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `landing_page` TEXT NULL AFTER `utm_term`;'));

-- ip_address_str (generated column for IPv4/IPv6 string representation)
SET @sql = IF(FIND_IN_SET('ip_address_str', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `ip_address_str` VARCHAR(45) GENERATED ALWAYS AS (INET6_NTOA(`ip_address`)) STORED;'));

-- device_type
SET @sql = IF(FIND_IN_SET('device_type', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `device_type` ENUM(\'desktop\',\'mobile\',\'tablet\',\'bot\') DEFAULT \'desktop\';'));

-- device_brand
SET @sql = IF(FIND_IN_SET('device_brand', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `device_brand` VARCHAR(100) NULL;'));

-- device_model
SET @sql = IF(FIND_IN_SET('device_model', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `device_model` VARCHAR(100) NULL;'));

-- os_name
SET @sql = IF(FIND_IN_SET('os_name', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `os_name` VARCHAR(100) NULL;'));

-- os_version
SET @sql = IF(FIND_IN_SET('os_version', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `os_version` VARCHAR(50) NULL;'));

-- browser_name
SET @sql = IF(FIND_IN_SET('browser_name', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `browser_name` VARCHAR(100) NULL;'));

-- browser_version
SET @sql = IF(FIND_IN_SET('browser_version', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `browser_version` VARCHAR(50) NULL;'));

-- latitude
SET @sql = IF(FIND_IN_SET('latitude', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `latitude` DECIMAL(10,8) NULL;'));

-- longitude
SET @sql = IF(FIND_IN_SET('longitude', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `longitude` DECIMAL(11,8) NULL;'));

-- company_name
SET @sql = IF(FIND_IN_SET('company_name', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `company_name` VARCHAR(255) NULL;'));

-- identified_email
SET @sql = IF(FIND_IN_SET('identified_email', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `identified_email` VARCHAR(255) NULL;'));

-- identified_phone
SET @sql = IF(FIND_IN_SET('identified_phone', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `identified_phone` VARCHAR(50) NULL;'));

-- b2b_confidence
SET @sql = IF(FIND_IN_SET('b2b_confidence', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_sessions` ADD COLUMN `b2b_confidence` TINYINT DEFAULT 0;'));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add missing columns to tracking_events
SET @cols := (SELECT IFNULL(GROUP_CONCAT(COLUMN_NAME), '') FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracking_events');

SET @sql = '';

-- element_selector
SET @sql = IF(FIND_IN_SET('element_selector', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_events` ADD COLUMN `element_selector` VARCHAR(300) NULL AFTER `page_title`;'));

-- element_text
SET @sql = IF(FIND_IN_SET('element_text', @cols), @sql, CONCAT(@sql, 'ALTER TABLE `tracking_events` ADD COLUMN `element_text` VARCHAR(300) NULL AFTER `element_selector`;'));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update event_type ENUM to include all event types
SET @colInfo := (SELECT COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tracking_events' AND COLUMN_NAME = 'event_type');

-- Check if old ENUM is missing new values
SET @needsUpdate = IF(@colInfo LIKE '%exit_intent_triggered%' AND @colInfo LIKE '%gated_view%', 0, 1);

SET @sql = IF(@needsUpdate,
    'ALTER TABLE `tracking_events` MODIFY COLUMN `event_type` ENUM(\'pageview\',\'click\',\'scroll\',\'form_start\',\'form_submit\',\'form_abandon\',\'download\',\'exit_intent\',\'exit_intent_submit\',\'exit_intent_triggered\',\'exit_intent_converted\',\'view_pricing\',\'view_demo\',\'click_whatsapp\',\'gated_view\') NOT NULL',
    'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
