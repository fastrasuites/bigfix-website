-- BigFix Landing Page - Submissions Table Schema
-- Run this in cPanel -> phpMyAdmin after creating your database

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source` varchar(50) NOT NULL DEFAULT 'unknown',
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `product` varchar(100) DEFAULT NULL,
  `industry` varchar(100) DEFAULT NULL,
  `users` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` varchar(50) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `source_index` (`source`),
  KEY `created_at_index` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: View to easily see recent submissions
CREATE VIEW IF NOT EXISTS `submissions_recent` AS
SELECT id, source, name, email, phone, company, created_at
FROM submissions
ORDER BY created_at DESC;
