<?php
/**
 * Receive batched tracking events
 * POST /api/tracking/events.php
 * Body: {session_id, events: [{type, url, data, ...}]}
 */
declare(strict_types=1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$configFile = __DIR__ . '/../../../submit-config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error']);
    exit;
}

$config = require $configFile;

$raw = file_get_contents('php://input');
if (strlen($raw) > 100000) { // 100KB max
    http_response_code(413);
    echo json_encode(['success' => false, 'error' => 'Payload too large']);
    exit;
}

$input = json_decode($raw, true);
if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

$sessionId = $input['session_id'] ?? '';
$events = $input['events'] ?? [];

if ($sessionId === '' || !is_array($events) || count($events) === 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'session_id and events required']);
    exit;
}

// Validate session_id format (UUID v4)
if (!preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $sessionId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid session_id format']);
    exit;
}

// Limit batch size
if (count($events) > 50) {
    $events = array_slice($events, 0, 50);
}

$configFile = __DIR__ . '/../../../submit-config.php';
$config = require $configFile;

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
    $stmt = $pdo->prepare('SELECT 1 FROM `tracking_sessions` WHERE `id` = ?');
    $stmt->execute([$sessionId]);
    if (!$stmt->fetch()) {
        http_response_code(404);
        echo json_encode(['success' => false, 'error' => 'Session not found']);
        exit;
    }

    // Update session last_seen and page_count
    $pdo->prepare('UPDATE `tracking_sessions` SET `last_seen` = NOW(), `page_count` = `page_count` + 1 WHERE `id` = ?')->execute([$sessionId]);

    // Prepare batch insert
    $stmt = $pdo->prepare('
        INSERT INTO `tracking_events` (
            `session_id`, `event_type`, `page_url`, `page_title`, `referrer`,
            `event_data`, `time_on_page`, `scroll_depth`, `created_at`
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ');

    $accepted = 0;
    $dropped = 0;

    foreach ($events as $event) {
        $eventType = $event['type'] ?? '';
        $pageUrl = $event['url'] ?? '';
        $pageTitle = $event['title'] ?? null;
        $referrer = $event['referrer'] ?? null;
        $eventData = isset($event['data']) ? json_encode($event['data']) : null;
        $timeOnPage = isset($event['time_on_page']) ? (int)$event['time_on_page'] : null;
        $scrollDepth = isset($event['scroll_depth']) ? (int)$event['scroll_depth'] : null;

        // Validate required fields
        $validTypes = ['pageview', 'click', 'scroll', 'form_start', 'form_submit', 'form_abandon', 'download', 'exit_intent', 'exit_intent_submit'];
        if (!in_array($eventType, $validTypes, true) || $pageUrl === '') {
            $dropped++;
            continue;
        }

        try {
            $stmt->execute([
                $sessionId, $eventType, $pageUrl, $pageTitle, $referrer,
                $eventData, $timeOnPage, $scrollDepth
            ]);
            $accepted++;
        } catch (Throwable $e) {
            $dropped++;
            error_log('Tracking event insert error: ' . $e->getMessage());
        }
    }

    // Update session page_count based on pageviews
    $pageviews = 0;
    foreach ($events as $event) {
        if (($event['type'] ?? '') === 'pageview') $pageviews++;
    }
    if ($pageviews > 0) {
        $pdo->prepare('UPDATE `tracking_sessions` SET `page_count` = `page_count` + ? WHERE `id` = ?')->execute([$pageviews, $sessionId]);
    }

    echo json_encode([
        'success' => true,
        'accepted' => $accepted,
        'dropped' => $dropped,
    ]);

} catch (Throwable $e) {
    error_log('Tracking events error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to save events']);
}