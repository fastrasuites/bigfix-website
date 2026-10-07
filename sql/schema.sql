-- BigFix submissions table (covers all three forms: contact, book_demo, home_review)
-- Run in phpMyAdmin (SQL tab) against your `bigfix` database.

CREATE DATABASE IF NOT EXISTS bigfix CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bigfix;

CREATE TABLE IF NOT EXISTS submissions (
    id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
    source     VARCHAR(30)  NOT NULL,            -- contact | book_demo | home_review

    -- Common
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL,

    -- contact
    subject    VARCHAR(200) NULL,
    message    TEXT         NULL,

    -- book_demo
    phone      VARCHAR(30)  NULL,
    date       DATE         NULL,                -- YYYY-MM-DD
    time       VARCHAR(20)  NULL,                -- e.g. "10:00" or "10:00 AM"
    users      VARCHAR(50)  NULL,
    notes      TEXT         NULL,

    -- home_review ("Request a Systems Architecture Review")
    company    VARCHAR(150) NULL,                -- Company Name
    product    VARCHAR(150) NULL,                -- Primary Product of Interest (e.g. FastraSuite)
    operation  VARCHAR(150) NULL,                -- Primary Operation (e.g. Managing Construction)
    timeline   VARCHAR(50)  NULL,                -- Estimated Project Timeline (e.g. 3-6 Months)
    industry   VARCHAR(100) NULL,                -- legacy field, kept for old rows

    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    KEY idx_source_created (source, created_at),
    KEY idx_email (email),
    KEY idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------
-- ALREADY HAVE a submissions table? Don't run the CREATE above.
-- Run these instead to add the two new columns (skip any that exist):
--
-- ALTER TABLE submissions
--     ADD COLUMN operation VARCHAR(150) NULL AFTER product,
--     ADD COLUMN timeline  VARCHAR(50)  NULL AFTER operation;
--
-- If `industry` was NOT NULL, relax it:
-- ALTER TABLE submissions MODIFY industry VARCHAR(100) NULL;
-- ---------------------------------------------------------------