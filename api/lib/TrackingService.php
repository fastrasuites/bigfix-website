<?php
/**
 * TrackingService.php - Core tracking service
 * 
 * Handles:
 * - Upsert tracking sessions (INSERT ... ON DUPLICATE KEY UPDATE)
 * - Insert tracking events with batch support
 * - User identification (email/phone linking)
 * - Integration with IpEnricher and DeviceDetector
 * 
 * Type-safe, production-grade, follows strict typing
 */
declare(strict_types=1);

namespace BigFix\Tracking;

use PDO;
use Exception;

/**
 * TrackingService - Main service class for all tracking operations
 * 
 * Usage:
 * $service = new TrackingService($pdo);
 $service->upsertSession($ip, $userAgent, $landingPage);
 $service->insertEvent($sessionId, $eventType, $pageData);
 $service->identify($sessionId, $email, $phone);
 */
class TrackingService {
  private PDO $pdo;
  private IpEnricher $ipEnricher;
  private DeviceDetector $deviceDetector;

  /**
   * Constructor
   * 
   * @param PDO $pdo Database connection
   * @param IpEnricher|null $ipEnricher IP enrichment service
   * @param DeviceDetector|null $deviceDetector Device detection service
   */
  public function __construct(PDO $pdo, ?IpEnricher $ipEnricher = null, ?DeviceDetector $deviceDetector = null) {
    $this->pdo = $pdo;
    $this->ipEnricher = $ipEnricher ?? new IpEnricher();
    $this->deviceDetector = $deviceDetector ?? new DeviceDetector();
  }

  /**
   * Upsert tracking session - INSERT or UPDATE last_seen and page_count
   * 
   * @param string $sessionId UUID v4 session ID
   * @param string $ipAddress Client IP address
   * @param string $userAgent Full user agent string
   * @param string $landingPage Landing page URL
   * @param string $referrer Referrer URL
   * @return array[sessionId, wasNew: bool, company_name, is_b2b]
   */
  public function upsertSession(string $sessionId, string $ipAddress, string $userAgent, string $landingPage = '', string $referrer = ''): array {
    // Enrich IP to get geo/data
    $enriched = $this->ipEnricher->enrich($ipAddress);
    list (
      $countryCode,
      $region,
      $city,
      $latitude,
      $longitude,
      $isp,
      $org,
      $companyName,
      $isB2B,
      $b2bConfidence
    ) = $enriched;

    // Detect device
    $deviceInfo = $this->deviceDetector->detect($userAgent);
    list (
      $deviceType,
      $deviceBrand,
      $deviceModel,
      $osName,
      $osVersion,
      $browserName,
      $browserVersion
    ) = $deviceInfo;

    // Insert or update session
    $stmt = $this->pdo->prepare('
      INSERT INTO `tracking_sessions` (
        `id`, `ip_address`, `ip_address_str`, `user_agent`,
        `device_type`, `device_brand`, `device_model`,
        `os_name`, `os_version`, `browser_name`, `browser_version`,
        `country_code`, `region`, `city`, `latitude`, `longitude`,
        `isp`, `org`, `company_name`, `is_b2b`, `b2b_confidence`,
        `landing_page`, `referrer`
      ) VALUES (
        ?, ?, INET6_ATON(?), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      ON DUPLICATE KEY UPDATE
        `last_seen` = NOW(),
        `page_count` = `page_count` + 1,
        `ip_address` = VALUES(`ip_address`),
        `user_agent` = VALUES(`user_agent`),
        `device_type` = VALUES(`device_type`),
        `device_brand` = VALUES(`device_brand`),
        `device_model` = VALUES(`device_model`),
        `os_name` = VALUES(`os_name`),
        `os_version` = VALUES(`os_version`),
        `browser_name` = VALUES(`browser_name`),
        `browser_version` = VALUES(`browser_version`),
        `country_code` = VALUES(`country_code`),
        `region` = VALUES(`region`),
        `city` = VALUES(`city`),
        `latitude` = VALUES(`latitude`),
        `longitude` = VALUES(`longitude`),
        `isp` = VALUES(`isp`),
        `org` = VALUES(`org`),
        `company_name` = VALUES(`company_name`),
        `is_b2b` = VALUES(`is_b2b`),
        `b2b_confidence` = VALUES(`b2b_confidence`),
        `last_seen` = NOW(),
        `page_count` = `page_count` + 1,
        `landing_page` = VALUES(`landing_page`),
        `referrer` = VALUES(`referrer`)
    ');
    
    $ipBinary = inet_pton($ipAddress);
    
    $stmt->execute([
      $sessionId,
      $ipBinary,
      $ipAddress,
      $userAgent,
      $deviceType,
      $deviceBrand,
      $deviceModel,
      $osName,
      $osVersion,
      $browserName,
      $browserVersion,
      $countryCode,
      $region,
      $city,
      $latitude,
      $longitude,
      $isp,
      $org,
      $companyName,
      $isB2B ? 1 : 0,
      $b2bConfidence,
      $landingPage,
      $referrer,
    ]);

    // Return session info
    return [
      'sessionId' => $sessionId,
      'wasNew' => $stmt->rowCount() > 0 && strpos($stmt->debugInfo() ?? '', 'already exists') === false,
      'company_name' => $companyName,
      'is_b2b' => $isB2B,
    ];
  }

  /**
   * Insert a tracking event for a session
   * 
   * @param string $sessionId Session ID
   * @param string $eventType Event type enum value
   * @param string $pageUrl Page URL
   * @param string $pageTitle Page title
   * @param string $elementSelector CSS selector (for click events)
   * @param string $elementText Element text (for click events)
   * @param int $scrollDepth Scroll depth percentage (0-100)
   * @param int $timeOnPage Time on page in seconds
   * @param array $eventData Additional event data as JSON
   * @return int Event ID
   */
  public function insertEvent(string $sessionId, string $eventType, string $pageUrl, string $pageTitle = '', string $elementSelector = '', string $elementText = '', int $scrollDepth = 0, int $timeOnPage = 0, array $eventData = []): int {
    // Prepare event data JSON
    $eventDataJson = json_encode($eventData, JSON_THROW_ON_ERROR);

    // Insert event
    $stmt = $this->pdo->prepare('
      INSERT INTO `tracking_events` (
        `session_id`, `event_type`, `page_url`, `page_title`,
        `element_selector`, `element_text`, `scroll_depth`, `time_on_page`,
        `event_data`, `created_at`
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ');

    $stmt->execute([
      $sessionId,
      $eventType,
      $pageUrl,
      $pageTitle,
      $elementSelector,
      $elementText,
      $scrollDepth,
      $timeOnPage,
      $eventDataJson,
    ]);

    $eventId = $this->pdo->lastInsertId();

    // Update session: increment total_time based on time_on_page
    // We add the time_on_page to the session's total_time
    $updateStmt = $this->pdo->prepare('
      UPDATE `tracking_sessions` SET `total_time` = `total_time` + ?, `last_seen` = NOW() WHERE `id` = ?
    ');
    $updateStmt->execute([$timeOnPage, $sessionId]);

    return $eventId;
  }

  /**
   * Batch insert tracking events with transaction
   * 
   * @param string $sessionId Session ID
   * @param array $events Array of event arrays
   * @return array[inserted: int, skipped: int]
   */
  public function batchInsertEvents(string $sessionId, array $events): array {
    $inserted = 0;
    $skipped = 0;

    // Start transaction
    $this->pdo->beginTransaction();

    try {
      foreach ($events as $event) {
        // Validate required fields
        $eventType = $event['event_type'] ?? '';
        $pageUrl = $event['page_url'] ?? '';

        if ($eventType === '' || $pageUrl === '') {
          $skipped++;
          continue;
        }

        // Validate event type
        $validTypes = [
          'pageview', 'click', 'scroll', 'form_start', 'form_submit',
          'view_pricing', 'view_demo', 'click_whatsapp',
          'exit_intent_triggered', 'exit_intent_converted', 'gated_view',
        ];

        if (!in_array($eventType, $validTypes, true)) {
          $skipped++;
          continue;
        }

        $pageTitle = $event['page_title'] ?? '';
        $elementSelector = $event['element_selector'] ?? '';
        $elementText = $event['element_text'] ?? '';
        $scrollDepth = (int)($event['scroll_depth'] ?? 0);
        $timeOnPage = (int)($event['time_on_page'] ?? 0);
        $eventData = $event['event_data'] ?? [];

        $this->insertEvent(
          $sessionId,
          $eventType,
          $pageUrl,
          $pageTitle,
          $elementSelector,
          $elementText,
          $scrollDepth,
          $timeOnPage,
          $eventData
        );

        $inserted++;
      }

      // Commit transaction
      $this->pdo->commit();
    } catch (Exception $e) {
      // Rollback on error
      $this->pdo->rollBack();
      error_log("TrackingService: batch insert transaction failed: " . $e->getMessage());
      $skipped = count($events);
    }

    return ['inserted' => $inserted, 'skipped' => $skipped];
  }

  /**
   * Identify user - link session to email/phone and mark as converted
   * 
   * @param string $sessionId Session ID
   * @param string $email User email
   * @param string $phone User phone
   * @param string $source Source of identification (e.g., 'form_submit', 'exit_intent')
   * @return array[success: bool, rowsUpdated: int]
   */
  public function identify(string $sessionId, string $email, string $phone, string $source = ''): array {
    // Validate email format
    if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
      return ['success' => false, 'rowsUpdated' => 0];
    }

    // Validate phone (should match international format)
    if ($phone !== '' && !preg_match('/^[\d\s\-\+\(\)]{7,}$/', $phone)) {
      return ['success' => false, 'rowsUpdated' => 0];
    }

    // Update session with identification data
    $stmt = $this->pdo->prepare('
      UPDATE `tracking_sessions` SET
        `identified_email` = COALESCE(?, `identified_email`),
        `identified_phone` = COALESCE(?, `identified_phone`),
        `is_converted` = TRUE,
        `converted_at` = NOW()
      WHERE `id` = ?
    ');

    $stmt->execute([$email ?: null, $phone ?: null, $sessionId]);
    $rowsUpdated = $stmt->rowCount();

    // Try to link to submissions if email matches
    if ($email !== '') {
      // Check if there's a submissions row with matching email
      // This is a simplified link - in production, you'd check the submissions table
      $linkStmt = $this->pdo->prepare('
        UPDATE `submissions` SET `session_id` = ?, `visitor_id` = ?
        WHERE `email` = ? AND (`session_id` IS NULL OR `session_id` = ?)
      ');
      $linkStmt->execute([$sessionId, $sessionId, $email, $sessionId]);
    }

    return [
      'success' => true,
      'rowsUpdated' => $rowsUpdated,
    ];
  }

  /**
   * Get B2B status for an IP
   * 
   * @param string $ip IP address
   * @return array[is_b2b: bool, confidence: int, company_name: string]
   */
  public function getB2BStatus(string $ip): array {
    $enriched = $this->ipEnricher->enrich($ip);
    return [
      'is_b2b' => $enriched[8] ?? false,
      'confidence' => $enriched[9] ?? 0,
      'company_name' => $enriched[6] ?? '',
    ];
  }
}