-- Absolute Tracking Feature - Database Migration
-- Run this on production database (MySQL 8.0+)
-- Version: 1.0
-- Date: 2026-10-10

-- ============================================================
-- TRACKING SESSIONS TABLE
-- Lightweight session metadata (one row per visitor session)
-- ============================================================
CREATE TABLE IF NOT EXISTS `tracking_sessions` (
    `id` CHAR(36) NOT NULL COMMENT 'UUID v4 - session identifier',
    `first_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Session start time',
    `last_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last activity timestamp',
    `page_count` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Number of pages viewed in session',
    `total_time` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Total time on site in seconds',
    `is_converted` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether user submitted a form',
    `converted_at` DATETIME NULL COMMENT 'Timestamp of first conversion',
    `user_id` INT UNSIGNED NULL COMMENT 'Linked user ID after form submission',
    `submission_id` INT UNSIGNED NULL COMMENT 'Linked submission ID',
    `ip_address` VARBINARY(16) NOT NULL COMMENT 'IPv4/IPv6 binary (INET6_ATON)',
    `user_agent` TEXT NOT NULL COMMENT 'Full user agent string',
    `referrer` VARCHAR(500) NULL COMMENT 'HTTP referrer',
    `utm_source` VARCHAR(100) NULL,
    `utm_medium` VARCHAR(100) NULL,
    `utm_campaign` VARCHAR(100) NULL,
    `utm_content` VARCHAR(100) NULL,
    `utm_term` VARCHAR(100) NULL,
    
    -- Geo/Company enrichment (populated async)
    `country_code` CHAR(2) NULL,
    `region` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `isp` VARCHAR(100) NULL,
    `org` VARCHAR(200) NULL COMMENT 'Organization from ip-api.com',
    `is_b2b` BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'True if org suggests B2B company',
    
    -- Exit intent capture
    `exit_intent_captured` BOOLEAN NOT NULL DEFAULT FALSE,
    `exit_intent_email` VARCHAR(150) NULL,
    `exit_intent_phone` VARCHAR(30) NULL,
    `exit_intent_captured_at` DATETIME NULL,
    
    PRIMARY KEY (`id`),
    INDEX `idx_last_seen` (`last_seen`),
    INDEX `idx_user` (`user_id`),
    INDEX `idx_converted` (`is_converted`, `converted_at`),
    INDEX `idx_ip` (`ip_address`),
    INDEX `idx_org` (`org`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracking sessions - one row per visitor session';


-- ============================================================
-- TRACKING EVENTS TABLE
-- Detailed event log (high volume, separate from sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS `tracking_events` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `session_id` CHAR(36) NOT NULL COMMENT 'FK to tracking_sessions.id',
    `user_id` INT UNSIGNED NULL COMMENT 'Linked after form submission',
    `submission_id` INT UNSIGNED NULL COMMENT 'Linked after form submission',
    
    -- Event classification
    `event_type` ENUM(
        'pageview',
        'click',
        'scroll',
        'form_start',
        'form_submit',
        'form_abandon',
        'download',
        'exit_intent',
        'exit_intent_submit'
    ) NOT NULL,
    
    -- Page context
    `page_url` VARCHAR(500) NOT NULL,
    `page_title` VARCHAR(200) NULL,
    `referrer` VARCHAR(500) NULL,
    
    -- Event-specific data (JSON for flexibility)
    `event_data` JSON NULL COMMENT '{
        "element": "button.cta",
        "selector": "#pricing .btn-primary",
        "text": "Get Started",
        "scroll_depth": 75,
        "time_on_page": 45,
        "exit_intent_type": "mouseleave|scroll_up|back_button"
    }',
    
    -- Timing
    `time_on_page` INT UNSIGNED NULL COMMENT 'Seconds on page before event',
    `scroll_depth` TINYINT UNSIGNED NULL COMMENT '0-100 percentage',
    
    -- Metadata
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (`id`),
    INDEX `idx_session_created` (`session_id`, `created_at`),
    INDEX `idx_user_created` (`user_id`, `created_at`),
    INDEX `idx_submission` (`submission_id`),
    INDEX `idx_type_created` (`event_type`, `created_at`),
    INDEX `idx_created` (`created_at`),
    
    FOREIGN KEY (`session_id`) REFERENCES `tracking_sessions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tracking events - detailed behavior log';


-- ============================================================
-- PARTITIONING FOR PERFORMANCE (Optional - for high volume)
-- Uncomment if you expect >1M events/month
-- ============================================================
-- ALTER TABLE `tracking_events` 
-- PARTITION BY RANGE (TO_DAYS(`created_at`)) (
--     PARTITION p202401 VALUES LESS THAN (TO_DAYS('2024-02-01')),
--     PARTITION p202402 VALUES LESS THAN (TO_DAYS('2024-03-01')),
--     PARTITION p202403 VALUES LESS THAN (TO_DAYS('2024-04-01')),
--     PARTITION p202404 VALUES LESS THAN (TO_DAYS('2024-05-01')),
--     PARTITION p202405 VALUES LESS THAN (TO_DAYS('2024-06-01')),
--     PARTITION p202406 VALUES LESS THAN (TO_DAYS('2024-07-01')),
--     PARTITION p202407 VALUES LESS THAN (TO_DAYS('2024-08-01')),
--     PARTITION p202408 VALUES LESS THAN (TO_DAYS('2024-09-01')),
--     PARTITION p202409 VALUES LESS THAN (TO_DAYS('2024-10-01')),
--     PARTITION p202410 VALUES LESS THAN (TO_DAYS('2024-11-01')),
--     PARTITION p202411 VALUES LESS THAN (TO_DAYS('2024-12-01')),
--     PARTITION p202412 VALUES LESS THAN (TO_DAYS('2025-01-01')),
--     PARTITION p_future VALUES LESS THAN MAXVALUE
-- );


-- ============================================================
-- CLEANUP STORED PROCEDURE (Run via cron or probabilistic trigger)
-- ============================================================
DELIMITER $$

CREATE PROCEDURE `CleanupTrackingData`()
BEGIN
    DECLARE rows_deleted_events INT DEFAULT 0;
    DECLARE rows_deleted_sessions INT DEFAULT 0;
    
    -- Delete events older than 90 days
    DELETE FROM `tracking_events` 
    WHERE `created_at` < DATE_SUB(NOW(), INTERVAL 90 DAY);
    SET rows_deleted_events = ROW_COUNT();
    
    -- Delete sessions older than 1 year that never converted
    DELETE FROM `tracking_sessions` 
    WHERE `last_seen` < DATE_SUB(NOW(), INTERVAL 1 YEAR) 
      AND `is_converted` = FALSE;
    SET rows_deleted_sessions = ROW_COUNT();
    
    -- Log cleanup (optional - could write to log table)
    SELECT CONCAT('Cleanup: ', rows_deleted_events, ' events, ', rows_deleted_sessions, ' sessions deleted') AS `result`;
END$$

DELIMITER ;


-- ============================================================
-- ENRICHMENT STORED PROCEDURE (Call after session creation)
-- Updates geo/org data using ip-api.com (run async)
-- ============================================================
DELIMITER $$

CREATE PROCEDURE `EnrichTrackingSession`(IN p_session_id CHAR(36))
BEGIN
    DECLARE v_ip_str VARCHAR(45);
    DECLARE v_country_code CHAR(2);
    DECLARE v_region VARCHAR(100);
    DECLARE v_city VARCHAR(100);
    DECLARE v_isp VARCHAR(100);
    DECLARE v_org VARCHAR(200);
    DECLARE v_is_b2b BOOLEAN DEFAULT FALSE;
    
    -- Get IP as string
    SELECT INET6_NTOA(`ip_address`) INTO v_ip_str 
    FROM `tracking_sessions` WHERE `id` = p_session_id;
    
    IF v_ip_str IS NOT NULL AND v_ip_str NOT IN ('127.0.0.1', '::1') THEN
        -- In production, call ip-api.com API here (async via PHP)
        -- This procedure is a placeholder for the update logic
        -- Actual enrichment done in PHP via ip-api.com API
        
        -- Example update (called from PHP after API call):
        -- UPDATE `tracking_sessions` SET 
        --     `country_code` = 'NG',
        --     `region` = 'Lagos',
        --     `city` = 'Lagos',
        --     `isp` = 'MTN Nigeria',
        --     `org` = 'MTN Nigeria',
        --     `is_b2b` = FALSE
        -- WHERE `id` = p_session_id;
    END IF;
END$$

DELIMITER ;


-- ============================================================
-- IDENTIFY PROCEDURE (Called on form submission)
-- Links session to user/submission + marks converted
-- ============================================================
DELIMITER $$

CREATE PROCEDURE `IdentifyTrackingSession`(
    IN p_session_id CHAR(36),
    IN p_user_id INT UNSIGNED,
    IN p_submission_id INT UNSIGNED,
    IN p_email VARCHAR(150),
    IN p_phone VARCHAR(30)
)
BEGIN
    UPDATE `tracking_sessions` 
    SET 
        `is_converted` = TRUE,
        `converted_at` = COALESCE(`converted_at`, NOW()),
        `user_id` = p_user_id,
        `submission_id` = p_submission_id
    WHERE `id` = p_session_id;
    
    -- Link all events to user/submission
    UPDATE `tracking_events` 
    SET 
        `user_id` = p_user_id,
        `submission_id` = p_submission_id
    WHERE `session_id` = p_session_id;
    
    SELECT ROW_COUNT() AS `rows_updated`;
END$$

DELIMITER ;


-- ============================================================
-- EXIT INTENT CAPTURE PROCEDURE
-- ============================================================
DELIMITER $$

CREATE PROCEDURE `CaptureExitIntent`(
    IN p_session_id CHAR(36),
    IN p_email VARCHAR(150),
    IN p_phone VARCHAR(30),
    IN p_exit_type ENUM('mouseleave', 'scroll_up', 'back_button', 'blur')
)
BEGIN
    UPDATE `tracking_sessions` 
    SET 
        `exit_intent_captured` = TRUE,
        `exit_intent_email` = p_email,
        `exit_intent_phone` = p_phone,
        `exit_intent_captured_at` = NOW()
    WHERE `id` = p_session_id;
    
    -- Also log as event
    INSERT INTO `tracking_events` (
        `session_id`, `event_type`, `page_url`, `event_data`, `created_at`
    ) VALUES (
        p_session_id,
        'exit_intent_submit',
        (SELECT `page_url` FROM `tracking_events` WHERE `session_id` = p_session_id ORDER BY `created_at` DESC LIMIT 1),
        JSON_OBJECT(
            'email', p_email,
            'phone', p_phone,
            'exit_type', p_exit_type
        ),
        NOW()
    );
    
    SELECT ROW_COUNT() AS `rows_updated`;
END$$

DELIMITER ;