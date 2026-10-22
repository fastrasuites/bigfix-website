<?php
declare(strict_types=1);
ob_start();

/**
 * BigFix Analytics Dashboard — self-hosted web analytics.
 * Protected by the same session auth as dashboard.php.
 *
 * Shows: sessions, events, page views, device/browser breakdown,
 * UTM sources, scroll depth, B2B ratio, time-on-page.
 */

$config = require __DIR__ . '/submit-config.php';
$config['dash_user']       = $config['dash_user'] ?? '';
$config['dash_pass_hash']  = $config['dash_pass_hash'] ?? '';

// ---- Security headers ----
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'none'; style-src 'nonce-$nonce' 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

// ---- Session ----
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('bf_admin');
session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'secure' => $https,
    'httponly' => true, 'samesite' => 'Strict',
]);
session_start();

const IDLE_TIMEOUT = 1800;
const MAX_FAILS    = 5;
const LOCK_SECONDS = 900;

if (!empty($_SESSION['auth']) && time() - ($_SESSION['last'] ?? 0) > IDLE_TIMEOUT) {
    $_SESSION = [];
    session_regenerate_id(true);
}
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

// ---- Helpers ----
function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }
function csrfOk(): bool { return isset($_POST['csrf']) && hash_equals($_SESSION['csrf'], (string)$_POST['csrf']); }
function throttleFile(): string { return sys_get_temp_dir() . '/bf_login_' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'x') . '.json'; }
function pdo(array $c): PDO {
    return new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4", $c['db_user'], $c['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]);
}

// ---- Login / Logout (reuse dashboard auth) ----
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrfOk()) { http_response_code(403); exit('Invalid request.'); }
    $action = $_POST['action'] ?? '';
    if ($action === 'login') {
        $u = (string)($_POST['username'] ?? '');
        $p = (string)($_POST['password'] ?? '');
        if (hash_equals((string)$config['dash_user'], $u) && password_verify($p, (string)$config['dash_pass_hash'])) {
            @unlink(throttleFile());
            session_regenerate_id(true);
            $_SESSION['auth'] = true;
            $_SESSION['last'] = time();
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
            exit;
        }
        $loginError = 'Invalid username or password.';
    } elseif ($action === 'logout') {
        $_SESSION = []; session_destroy();
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    }
}

// ---- Auth gate ----
if (empty($_SESSION['auth'])) {
    // Render login screen (reuse dashboard style)
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width,initial-scale=1"><title>Analytics Login</title>';
    echo '<style nonce="' . $nonce . '">
        :root{--bg:#f5f6f8;--card:#fff;--text:#1c2330;--muted:#6b7280;--line:#e5e7eb;--accent:#2563eb}
        *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--text)}
        .login{max-width:340px;margin:12vh auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:24px}
        .login input{width:100%;margin-bottom:12px}.err{color:#dc2626;margin-bottom:12px}
    </style></head><body>';
    echo '<form class="login" method="post" autocomplete="off"><h2>Analytics Access</h2>';
    if (!empty($loginError)) echo '<div class="err">' . h($loginError) . '</div>';
    echo '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf']) . '">';
    echo '<input type="hidden" name="action" value="login">';
    echo '<input name="username" placeholder="Username" required autofocus>';
    echo '<input name="password" type="password" placeholder="Password" required>';
    echo '<button style="width:100%;background:var(--accent);border-color:var(--accent);color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer">Log in</button></form>';
    echo '</body></html>';
    exit;
}

$_SESSION['last'] = time();

try {
    $db = pdo($config);
} catch (PDOException $e) {
    error_log('Analytics DB error: ' . $e->getMessage());
    http_response_code(500);
    ob_clean();
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

// ---- Date range selector ----
$days = (int)($_GET['days'] ?? 30);
$days = in_array($days, [7, 30, 90, 365], true) ? $days : 30;

// ---- Query analytics data ----

// Overview stats
$totalSessions = (int)$db->query('SELECT COUNT(*) FROM tracking_sessions')->fetchColumn();
$totalEvents   = (int)$db->query('SELECT COUNT(*) FROM tracking_events')->fetchColumn();
$b2bSessions   = (int)$db->query('SELECT COUNT(*) FROM tracking_sessions WHERE is_b2b = 1')->fetchColumn();
$b2bPct        = $totalSessions > 0 ? round($b2bSessions / $totalSessions * 100, 1) : 0;
$avgSessionTime = $db->query('SELECT AVG(total_time) FROM tracking_sessions WHERE total_time > 0')->fetchColumn();
$avgSessionMin  = $avgSessionTime ? round((float)$avgSessionTime) : 0;

// Daily activity (last N days)
$dailyStmt = $db->prepare("
    SELECT DATE(first_seen) as day, COUNT(*) as sessions
    FROM tracking_sessions
    WHERE first_seen >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE(first_seen)
    ORDER BY day
");
$dailyStmt->execute([$days]);
$dailySessions = $dailyStmt->fetchAll();

$dailyEventsStmt = $db->prepare("
    SELECT DATE(created_at) as day, COUNT(*) as events
    FROM tracking_events
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY day
");
$dailyEventsStmt->execute([$days]);
$dailyEvents = $dailyEventsStmt->fetchAll();

// Event types breakdown
$eventTypesStmt = $db->prepare("
    SELECT event_type, COUNT(*) as count
    FROM tracking_events
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY event_type
    ORDER BY count DESC
    LIMIT 15
");
$eventTypesStmt->execute([$days]);
$eventTypes = $eventTypesStmt->fetchAll();

// Top pages (from pageview events)
$topPagesStmt = $db->prepare("
    SELECT page_url, page_title, COUNT(*) as views
    FROM tracking_events
    WHERE event_type = 'pageview' AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY page_url
    ORDER BY views DESC
    LIMIT 10
");
$topPagesStmt->execute([$days]);
$topPages = $topPagesStmt->fetchAll();

// Device breakdown
$deviceStmt = $db->prepare("
    SELECT device_type, COUNT(*) as count
    FROM tracking_sessions
    WHERE first_seen >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY device_type
");
$deviceStmt->execute([$days]);
$devices = $deviceStmt->fetchAll();

// Browser breakdown
$browserStmt = $db->prepare("
    SELECT browser_name, COUNT(*) as count
    FROM tracking_sessions
    WHERE first_seen >= DATE_SUB(NOW(), INTERVAL ? DAY) AND browser_name != ''
    GROUP BY browser_name
    ORDER BY count DESC
    LIMIT 8
");
$browserStmt->execute([$days]);
$browsers = $browserStmt->fetchAll();

// UTM sources
$utmStmt = $db->prepare("
    SELECT utm_source, utm_medium, COUNT(*) as count
    FROM tracking_sessions
    WHERE utm_source IS NOT NULL AND utm_source != ''
      AND first_seen >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY utm_source, utm_medium
    ORDER BY count DESC
    LIMIT 10
");
$utmStmt->execute([$days]);
$utmSources = $utmStmt->fetchAll();

// Scroll depth stats
$scrollStmt = $db->prepare("
    SELECT
        MIN(scroll_depth) as min_depth,
        MAX(scroll_depth) as max_depth,
        AVG(scroll_depth) as avg_depth,
        COUNT(*) as total
    FROM tracking_events
    WHERE scroll_depth IS NOT NULL AND scroll_depth > 0
      AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
");
$scrollStmt->execute([$days]);
$scrollStats = $scrollStmt->fetch();

// Time on page stats
$timeStmt = $db->prepare("
    SELECT
        MIN(time_on_page) as min_time,
        MAX(time_on_page) as max_time,
        AVG(time_on_page) as avg_time,
        COUNT(*) as total
    FROM tracking_events
    WHERE time_on_page IS NOT NULL AND time_on_page > 0
      AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
");
$timeStmt->execute([$days]);
$timeStats = $timeStmt->fetch();

// Recent sessions
$recentStmt = $db->prepare("
    SELECT id, device_type, os_name, browser_name, country_code, is_b2b, page_count, total_time, first_seen
    FROM tracking_sessions
    WHERE first_seen >= DATE_SUB(NOW(), INTERVAL ? DAY)
    ORDER BY first_seen DESC
    LIMIT 20
");
$recentStmt->execute([$days]);
$recentSessions = $recentStmt->fetchAll();

// ---- Render page ----
$csrf = h($_SESSION['csrf']);
echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
echo '<meta name="robots" content="noindex,nofollow"><title>BigFix Analytics</title>';
echo '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>';
echo '<style nonce="' . $nonce . '">
    :root{--bg:#f5f6f8;--card:#fff;--text:#1c2330;--muted:#6b7280;--line:#e5e7eb;--accent:#2563eb;--green:#10b981;--blue:#3b82f6;--purple:#8b5cf6;--amber:#f59e0b}
    @media (prefers-color-scheme:dark){:root{--bg:#0f141b;--card:#171e28;--text:#e6e9ef;--muted:#8b95a5;--line:#263040}}
    *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--text)}
    header{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:var(--card);border-bottom:1px solid var(--line)}
    header h1{font-size:17px;margin:0}main{max-width:1200px;margin:24px auto;padding:0 16px}
    .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
    .stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
    .stat b{display:block;font-size:26px;font-weight:600}.stat span{color:var(--muted);font-size:13px}
    .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
    @media(max-width:768px){.grid2{grid-template-columns:1fr}}
    .chartwrap{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:12px}
    .chart{height:240px;position:relative;width:100%}
    table{width:100%;border-collapse:collapse}
    th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);font-size:13px;white-space:nowrap}
    th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
    tr:last-child td{border-bottom:0}
    a{color:var(--accent)}.tag{font-size:11px;padding:2px 8px;border-radius:99px;background:var(--bg);border:1px solid var(--line)}
    .bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;align-items:center}
    select,.btn{font:inherit;padding:6px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text);cursor:pointer}
    .btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
    .tabs{display:flex;gap:4px;margin-bottom:1px;border-bottom:1px solid var(--line)}
    .tab{padding:8px 16px;cursor:pointer;border:1px solid transparent;border-bottom:none;border-radius:8px 8px 0 0}
    .tab.active{background:var(--accent);color:#fff}
    .tab-inactive{background:var(--bg);color:var(--muted)}
    .tab-content{display:none}
    .tab-content.active{display:block}
</style>';
echo '<script nonce="' . $nonce . '">
// Tab switching
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".tab").forEach(function(tab) {
        tab.addEventListener("click", function() {
            var tabs = document.querySelectorAll(".tab");
            var contents = document.querySelectorAll(".tab-content");
            tabs.forEach(function(t){t.classList.remove("active");t.classList.add("tab-inactive");});
            contents.forEach(function(c){c.classList.remove("active");});
            this.classList.add("active");
            this.classList.remove("tab-inactive");
            document.getElementById("tab-" + this.dataset.tab).classList.add("active");
        });
    });
});
</script>';
echo '</head><body>';

echo '<header><h1>BigFix Analytics</h1><form class="inline" method="post">';
echo '<input type="hidden" name="csrf" value="' . $csrf . '">';
echo '<input type="hidden" name="action" value="logout">';
echo '<button>Log out</button></form>';
echo '<nav style="margin-left:16px"><a href="dashboard.php">Submissions</a> | <span style="color:var(--accent)">Analytics</span></nav>';
echo '</header>';
echo '<main>';

// ---- Range selector ----
echo '<div class="bar">';
echo '<form method="get" style="display:flex;gap:8px;align-items:center">';
echo '<label>Date range:</label>';
echo '<select name="days">';
foreach ([7 => '7 days', 30 => '30 days', 90 => '90 days', 365 => 'All time'] as $val => $label) {
    echo '<option value="' . $val . '" ' . ($val === $days ? 'selected' : '') . '>' . $label . '</option>';
}
echo '</select>';
echo '<button class="primary" type="submit">Apply</button>';
echo '</form>';
echo '<a class="btn" href="?export=csv&days=' . $days . '">Export CSV</a>';
echo '</div>';

// ---- Overview cards ----
echo '<div class="cards">';
printf('<div class="stat"><b>%d</b><span>Total Sessions</span></div>', $totalSessions);
printf('<div class="stat"><b>%d</b><span>Total Events</span></div>', $totalEvents);
printf('<div class="stat"><b>%.1f%%</b><span>B2B Sessions</span></div>', $b2bPct);
printf('<div class="stat"><b>%d:%02d</b><span>Avg. Session Time</span></div>', (int)($avgSessionMin / 60), (int)$avgSessionMin % 60);
echo '</div>';

// ---- Daily activity ----
echo '<div class="chartwrap">';
echo '<h3 style="margin-top:0">Daily Activity (last ' . $days . ' days)</h3>';
echo '<canvas class="chart" id="dailyChart"></canvas>';
echo '</div>';

// ---- Event types & Top pages (tabs) ----
echo '<div class="chartwrap">';
echo '<div class="tabs">';
echo '<div class="tab active" data-tab="events">Event Types</div>';
echo '<div class="tab tab-inactive" data-tab="pages">Top Pages</div>';
echo '</div>';
echo '<div id="tab-events" class="tab-content active"><canvas class="chart" id="eventChart" style="height:200px"></canvas></div>';
echo '<div id="tab-pages" class="tab-content"><div class="tablewrap"><table><tr><th>#</th><th>Page</th><th>Views</th></tr>';
foreach ($topPages as $i => $p) {
    $url = parse_url($p['page_url'], PHP_URL_PATH) ?: $p['page_url'];
    echo '<tr><td>' . ($i + 1) . '</td><td><a href="' . h($p['page_url']) . '">' . h($url) . '</a></td><td>' . (int)$p['views'] . '</td></tr>';
}
echo '</table></div></div>';
echo '</div>';

// ---- Device, Browser, UTM, Scroll ----
echo '<div class="grid2">';
echo '<div class="chartwrap"><h3>Device Breakdown</h3><canvas class="chart" id="deviceChart" style="height:180px"></canvas></div>';
echo '<div class="chartwrap"><h3>Top Browsers</h3><canvas class="chart" id="browserChart" style="height:180px"></canvas></div>';
echo '</div>';

echo '<div class="grid2">';
// UTM sources
echo '<div class="chartwrap"><h3>UTM Sources</h3>';
if (empty($utmSources)) {
    echo '<p style="color:var(--muted)">No UTM-tagged traffic in this period.</p>';
} else {
    echo '<table><tr><th>Source</th><th>Medium</th><th>Sessions</th></tr>';
    foreach ($utmSources as $u) {
        echo '<tr><td>' . h($u['utm_source']) . '</td><td>' . h($u['utm_medium']) . '</td><td>' . (int)$u['count'] . '</td></tr>';
    }
    echo '</table>';
}
echo '</div>';
// Stats cards
echo '<div class="chartwrap"><h3>Scroll & Time-on-Page</h3>';
echo '<div class="cards" style="margin-bottom:0">';
printf('<div class="stat"><b>%d</b><span>Avg. Scroll Depth</span></div>', $scrollStats && $scrollStats['avg_depth'] ? round((float)$scrollStats['avg_depth']) : 0);
printf('<div class="stat"><b>%d:%02d</b><span>Avg. Time on Page</span></div>', $scrollStats && $timeStats['avg_time'] ? (int)((float)$timeStats['avg_time'] / 60) : 0, $scrollStats && $timeStats['avg_time'] ? (int)((int)(float)$timeStats['avg_time'] % 60) : 0);
echo '</div></div>';
echo '</div>';

// ---- Recent sessions ----
echo '<div class="chartwrap">';
echo '<h3>Recent Sessions (last ' . $days . ' days)</h3>';
echo '<div class="tablewrap"><table>';
echo '<tr><th>ID</th><th>Device</th><th>Browser</th><th>Country</th><th>B2B</th><th>Pages</th><th>Time</th><th>Created</th></tr>';
foreach ($recentSessions as $s) {
    $b2bTag = $s['is_b2b'] ? '<span class="tag" style="background:rgba(16,185,129,.1)">B2B</span>' : '';
    printf('<tr><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%d</td><td>%d:%02d</td><td>%s</td></tr>',
        h(substr($s['id'], 0, 8)),
        h($s['device_type']),
        h($s['browser_name']),
        h($s['country_code']),
        $b2bTag,
        (int)$s['page_count'],
        (int)($s['total_time'] / 60), (int)(int)$s['total_time'] % 60,
        h($s['first_seen'])
    );
}
echo '</table></div>';
echo '</div>';

echo '</main>';

// ---- Chart.js initialization ----
$dailyLabels = [];
$dailyVals = [];
$dailyEventsVals = [];
// Build continuous date labels
$dates = [];
for ($i = $days - 1; $i >= 0; $i--) {
    $dates[] = date('Y-m-d', strtotime("-$i days"));
}
foreach ($dates as $d) {
    $dailyLabels[] = date('M d', strtotime($d));
    $sv = 0; $ev = 0;
    foreach ($dailySessions as $ds) { if (substr($ds['day'], 0, 10) === $d) $sv = (int)$ds['sessions']; }
    foreach ($dailyEvents as $de) { if (substr($de['day'], 0, 10) === $d) $ev = (int)$de['events']; }
    $dailyVals[] = $sv;
    $dailyEventsVals[] = $ev;
}

$eventLabels = array_column($eventTypes, 'event_type');
$eventCounts = array_map('intval', array_column($eventTypes, 'count'));

$deviceLabels = array_map(fn($d) => $d['device_type'], $devices);
$deviceCounts = array_map('intval', array_column($devices, 'count'));

$browserLabels = array_map(fn($b) => $b['browser_name'], $browsers);
$browserCounts = array_map('intval', array_column($browsers, 'count'));

echo '<script nonce="' . $nonce . '">
const ctx = (id) => document.getElementById(id).getContext("2d");
new Chart(ctx("dailyChart"), {
    type: "line",
    data: {
        labels: ' . json_encode($dailyLabels) . ',
        datasets: [
            {label:"Sessions",data:' . json_encode($dailyVals) . ',borderColor:"var(--accent)",tension:.3,fill:false,yAxisID:"y"},
            {label:"Events",data:' . json_encode($dailyEventsVals) . ',borderColor:"var(--green)",tension:.3,fill:false,yAxisID:"y1"}
        ]
    },
    options:{responsive:true,maintainAspectRatio:false,interaction:{mode:"index",intersect:false},
        scales:{y:{type:"linear",display:"auto",position:"left",grid:{display:false}},
                y1:{type:"linear",position:"right",grid:{drawBorder:false}},
                x:{grid:{display:false}}}
    }
});

new Chart(ctx("eventChart"), {
    type: "bar",
    data: {labels:' . json_encode($eventLabels) . ',datasets:[{label:"Events",data:' . json_encode($eventCounts) . ',backgroundColor:"var(--blue)"}]},
    options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",scales:{x:{beginAtZero:true,grid:{display:false}}}
});

new Chart(ctx("deviceChart"), {
    type: "doughnut",
    data: {labels:' . json_encode($deviceLabels) . ',datasets:[{data:' . json_encode($deviceCounts) . ',backgroundColor:["var(--blue)","var(--green)","var(--purple)","var(--amber)","var(--accent)"]}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom"}}}
});

new Chart(ctx("browserChart"), {
    type: "bar",
    data: {labels:' . json_encode($browserLabels) . ',datasets:[{label:"Sessions",data:' . json_encode($browserCounts) . ',backgroundColor:"var(--accent)"}]},
    options:{responsive:true,maintainAspectRatio:false,indexAxis:"y",scales:{x:{beginAtZero:true,grid:{display:false}}}
});
</script>';

echo '</body></html>';
