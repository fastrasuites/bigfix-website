-- ============================================================
-- 003_absolute_tracking.sql - Absolute Tracking Migration
-- ============================================================

-- ============================================================
-- TRACKING_SESSIONS Table
-- One row per visitor session with full enrichment data
-- ============================================================
CREATE TABLE IF NOT EXISTS `tracking_sessions` (
  `id` CHAR(36) PRIMARY KEY,
  `ip_address` VARBINARY(16) NOT NULL,
  `ip_address_str` VARCHAR(45) GENERATED ALWAYS AS (INET6_NTOA(ip_address)) STORED,
  `user_agent` TEXT NOT NULL,
  `device_type` ENUM('desktop','mobile','tablet','bot') DEFAULT 'desktop',
  `device_brand` VARCHAR(100) NULL,
  `device_model` VARCHAR(100) NULL,
  `os_name` VARCHAR(100) NULL,
  `os_version` VARCHAR(50) NULL,
  `browser_name` VARCHAR(100) NULL,
  `browser_version` VARCHAR(50) NULL,
  `country_code` CHAR(2) NULL,
  `region` VARCHAR(100) NULL,
  `city` VARCHAR(100) NULL,
  `latitude` DECIMAL(10,8) NULL,
  `longitude` DECIMAL(11,8) NULL,
  `isp` VARCHAR(255) NULL,
  `org` VARCHAR(255) NULL,
  `company_name` VARCHAR(255) NULL,
  `is_b2b` BOOLEAN DEFAULT FALSE,
  `b2b_confidence` TINYINT DEFAULT 0,
  `landing_page` TEXT NULL,
  `referrer` TEXT NULL,
  `referrer_domain` VARCHAR(255) NULL,
  `utm_source` VARCHAR(100) NULL,
  `utm_medium` VARCHAR(100) NULL,
  `utm_campaign` VARCHAR(100) NULL,
  `utm_content` VARCHAR(100) NULL,
  `utm_term` VARCHAR(100) NULL,
  `gclid` VARCHAR(255) NULL,
  `fbclid` VARCHAR(255) NULL,
  `first_seen` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `last_seen` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `page_count` INT UNSIGNED DEFAULT 0,
  `total_time` INT UNSIGNED DEFAULT 0,
  `is_converted` BOOLEAN DEFAULT FALSE,
  `converted_at` DATETIME NULL,
  `identified_email` VARCHAR(255) NULL,
  `identified_phone` VARCHAR(50) NULL,
  INDEX `idx_last_seen` (last_seen),
  INDEX `idx_b2b` (is_b2b),
  INDEX `idx_converted` (is_converted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TRACKING_EVENTS Table
-- Detailed event log per session
-- ============================================================
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
  INDEX `idx_submission` (submission_id),
  CONSTRAINT `fk_session` FOREIGN KEY (session_id) REFERENCES `tracking_sessions`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Update submissions table to link with tracking
-- ============================================================
ALTER TABLE `submissions` ADD COLUMN `visitor_id` CHAR(36) NULL, ADD COLUMN `session_id` CHAR(36) NULL, ADD COLUMN `tracking_snapshot` JSON NULL, ADD INDEX `idx_session` (session_id);

-- ============================================================
-- Update tracking_events ENUM to include all event types used by frontend
-- ============================================================
ALTER TABLE `tracking_events` MODIFY COLUMN `event_type` ENUM(
    'pageview','click','scroll','form_start','form_submit','form_abandon','download',
    'exit_intent','exit_intent_submit','exit_intent_triggered','exit_intent_converted',
    'view_pricing','view_demo','click_whatsapp','gated_view'
) NOT NULL;