<?php
/**
 * Tracking Events Endpoint - Absolute Tracking
 * POST /api/tracking/events.php
 * 
 * Request Body: {session_id: "uuid", events: [{event_type, page_url, page_title, element_selector, element_text, scroll_depth, time_on_page, event_data}]}
 * 
 * Features:
 * - Validates max 50 events per batch
 * - session_id from cookie or body
 * - Batch insert with transaction (PDO)
 * - INET6_ATON for IP storage
 * - Updates tracking_sessions total_time and last_seen
 */
declare(strict_types=1);
ob_start();

// Load config
$configFile = __DIR__ . '/../../submit-config.php';
if (!is_file($configFile)) {
    $configFile = __DIR__ . '/../../../submit-config.php';
}
if (!is_file($configFile)) {
    // Fallback config for shared hosting - uses same DB as main site
    $config = [
        'db_host' => '127.0.0.1',
        'db_name' => 'bigfixte_submissions',
        'db_user' => 'bigfixte_sub_user',
        'db_pass' => '}aM(lPXbzhSYd*A?',
        'allowed_origins' => [
            'https://bigfixtech.com',
            'https://www.bigfixtech.com',
        ],
    ];
} else {
    $config = require $configFile;
}

// CORS headers
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && in_array($origin, $config['allowed_origins'] ?? [], true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Rate limiting: simple in-file per-IP counter (for shared hosting)
$realIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
if ($realIp === '') {
    $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($xff !== '') {
        $realIp = trim(explode(',', $xff)[0]);
    } else {
        $realIp = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}
$realIp = trim($realIp);

if (!checkRateLimit($realIp)) {
    http_response_code(429);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Rate limit exceeded', 'retry_after' => 60]);
    exit;
}

// Parse input
$raw = file_get_contents('php://input');
if (strlen($raw) > 100000) { // 100KB max
    http_response_code(413);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Payload too large']);
    exit;
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

    // Initialize variables used in catch block
    $pdo = null;

    // Get session_id from body or cookie
    $sessionId = $input['session_id'] ?? $_COOKIE['tracking_sid'] ?? '';
    $events = $input['events'] ?? [];

    if ($sessionId === '' || !is_array($events) || count($events) === 0) {
        http_response_code(400);
        ob_clean();
        echo json_encode(['success' => false, 'error' => 'session_id and events required']);
        exit;
    }

    // Validate session_id format (UUID v4)
    if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionId)) {
        http_response_code(400);
        ob_clean();
        echo json_encode(['success' => false, 'error' => 'Invalid session_id format']);
        exit;
    }

    // Limit batch size
    if (count($events) > 50) {
        $events = array_slice($events, 0, 50);
    }

    $validEventTypes = [
        'pageview', 'click', 'scroll', 'form_start', 'form_submit',
        'form_abandon', 'download', 'exit_intent', 'exit_intent_submit',
        'view_pricing', 'view_demo', 'click_whatsapp',
        'exit_intent_triggered', 'exit_intent_converted', 'gated_view',
    ];

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

    // Verify session exists
    $stmt = $pdo->prepare('SELECT 1 FROM tracking_sessions WHERE id = ?');
    $stmt->execute([$sessionId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        ob_clean();
        echo json_encode(['success' => false, 'error' => 'Session not found']);
        exit;
    }

    // Get client IP for potential logging
    $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '';
    if ($clientIp === '') {
        $xff = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($xff !== '') {
            $clientIp = trim(explode(',', $xff)[0]);
        } else {
            $clientIp = $_SERVER['REMOTE_ADDR'] ?? '';
        }
    }
    $clientIp = trim($clientIp);

    // Start transaction for batch insert
    $pdo->beginTransaction();

    $accepted = 0;
    $dropped = 0;
    $totalTimeOnPage = 0;
    $pageviewCount = 0;

    // Detect available columns for schema compatibility
    $hasElementColumns = false;
    $colCheck = $pdo->query("SHOW COLUMNS FROM `tracking_events` LIKE 'element_selector'");
    if ($colCheck->fetch()) {
        $hasElementColumns = true;
    }

    foreach ($events as $event) {
        $eventType = $event['event_type'] ?? $event['type'] ?? '';
        $pageUrl = $event['page_url'] ?? $event['url'] ?? '';
        $pageTitle = $event['page_title'] ?? $event['title'] ?? null;
        $elementSelector = $event['element_selector'] ?? $event['selector'] ?? null;
        $elementText = $event['element_text'] ?? $event['text'] ?? null;
        $scrollDepth = isset($event['scroll_depth']) ? min(100, max(0, (int)$event['scroll_depth'])) : null;
        $timeOnPage = isset($event['time_on_page']) ? (int)$event['time_on_page'] : null;
        $eventData = $event['event_data'] ?? $event['data'] ?? null;

        // Validate event type
        if (!in_array($eventType, $validEventTypes, true) || $pageUrl === '') {
            $dropped++;
            continue;
        }

        // Track totals
        if ($timeOnPage !== null && $timeOnPage > 0) {
            $totalTimeOnPage += $timeOnPage;
        }
        if ($eventType === 'pageview') {
            $pageviewCount++;
        }

        try {
            if ($hasElementColumns) {
                $insertStmt = $pdo->prepare('
                    INSERT INTO tracking_events (
                        session_id, event_type, page_url, page_title,
                        element_selector, element_text, scroll_depth, time_on_page,
                        event_data, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                ');
                $insertStmt->execute([
                    $sessionId, $eventType, $pageUrl, $pageTitle,
                    $elementSelector, $elementText, $scrollDepth, $timeOnPage,
                    $eventData !== null ? json_encode($eventData) : null,
                ]);
            } else {
                // Fallback for older schemas without element_selector/element_text
                $mergedData = $eventData !== null ? $eventData : [];
                if ($elementSelector !== null) $mergedData['selector'] = $elementSelector;
                if ($elementText !== null) $mergedData['text'] = $elementText;
                $insertStmt = $pdo->prepare('
                    INSERT INTO tracking_events (
                        session_id, event_type, page_url, page_title,
                        scroll_depth, time_on_page, event_data, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                ');
                $insertStmt->execute([
                    $sessionId, $eventType, $pageUrl, $pageTitle,
                    $scrollDepth, $timeOnPage,
                    !empty($mergedData) ? json_encode($mergedData) : null,
                ]);
            }
            $accepted++;
        } catch (Throwable $e) {
            $dropped++;
            error_log("Tracking event insert error: " . $e->getMessage());
        }
    }

    // Update session: increment total_time and page_count, update last_seen
    if ($totalTimeOnPage > 0 || $pageviewCount > 0) {
        $updateStmt = $pdo->prepare('
            UPDATE tracking_sessions 
            SET total_time = total_time + ?, 
                page_count = page_count + ?, 
                last_seen = NOW() 
            WHERE id = ?
        ');
        $updateStmt->execute([$totalTimeOnPage, $pageviewCount, $sessionId]);
    } else {
        // Just update last_seen
        $pdo->prepare('UPDATE tracking_sessions SET last_seen = NOW() WHERE id = ?')->execute([$sessionId]);
    }

    $pdo->commit();

    ob_clean();
    echo json_encode([
        'success' => true,
        'accepted' => $accepted,
        'dropped' => $dropped,
    ]);

} catch (Throwable $e) {
    if ($pdo !== null) {
        try {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
        } catch (Throwable $e2) {
            // ignore rollback errors
        }
    }
    error_log("Tracking events error: " . $e->getMessage());
    http_response_code(500);
    ob_clean();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

/**
 * Simple rate limiting using file-based storage (for shared hosting)
 * Limits to 60 requests per minute per IP
 */
function checkRateLimit(string $ip): bool {
    $cacheDir = __DIR__ . '/../../cache';
    if (!is_dir($cacheDir)) {
        @mkdir($cacheDir, 0755, true);
    }
    $rateFile = $cacheDir . '/rate_limit_' . md5($ip) . '.json';
    $now = time();

    if (file_exists($rateFile)) {
        $data = json_decode(file_get_contents($rateFile), true);
        if ($data && isset($data['timestamp']) && isset($data['count'])) {
            $windowStart = $data['timestamp'];
            $count = $data['count'];

            // If within current minute window
            if ($now - $windowStart < 60) {
                if ($count >= 60) {
                    return false; // Rate limit exceeded
                }
                $count++;
            } else {
                // Reset window
                $windowStart = $now;
                $count = 1;
            }

            file_put_contents($rateFile, json_encode([
                'timestamp' => $windowStart,
                'count' => $count,
            ]));
            return true;
        }
    }

    // First request
    file_put_contents($rateFile, json_encode([
        'timestamp' => $now,
        'count' => 1,
    ]));
    return true;
}
