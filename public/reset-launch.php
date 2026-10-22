<?php
declare(strict_types=1);
ob_start();

/**
 * BigFix Launch Reset Script
 *
 * Resets ALL tracking analytics and submission data for a clean launch.
 * Requires admin authentication (same login as dashboard.php / analytics.php).
 *
 * URL: /reset-launch.php
 *
 * What it does:
 * - Truncates tracking_sessions, tracking_events, submissions tables
 * - Resets auto-increment counters
 * - Clears tracking cache files
 * - Provides detailed report of what was cleared
 *
 * Usage: Visit in browser, login, confirm. Or run via CLI:
 *   php -r "require 'public/reset-launch.php';"  (with DASH_USER env var set)
 */

$config = require __DIR__ . '/submit-config.php';
$config['dash_user']       = $config['dash_user'] ?? '';
$config['dash_pass_hash']  = $config['dash_pass_hash'] ?? '';

// ---- Security headers ----
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'none'; style_src 'nonce-$nonce' 'unsafe-inline'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('X-Frame-Options: ' . 'DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

// ---- CLI mode (for automated launch prep) ----
$isCli = PHP_SAPI === 'cli';

function pdo(array $c): PDO {
    return new PDO("mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4", $c['db_user'], $c['db_pass'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]);
}

function h(?string $s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

function jsonResponse(array $data, int $code = 200): void {
    ob_clean();
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// ---- CLI auth check ----
if ($isCli) {
    $cliUser = getenv('DASH_USER') ?: '';
    $cliPass = getenv('DASH_PASS') ?: '';
    $userOk = hash_equals((string)$config['dash_user'], $cliUser);
    $passOk = password_verify($cliPass, (string)$config['dash_pass_hash']);
    if (!$userOk || !$passOk) {
        fwrite(STDERR, "Unauthorized. Set DASH_USER and DASH_PASS env vars.\n");
        exit(1);
    }
} else {
    // ---- HTTP session auth ----
    $https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_name('bf_admin');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/', 'secure' => $https,
        'httponly' => true, 'samesite' => 'Strict',
    ]);
    session_start();

    define('IDLE_TIMEOUT', 1800);
    if (!empty($_SESSION['auth']) && time() - ($_SESSION['last'] ?? 0) > IDLE_TIMEOUT) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }

    // ---- Login handler ----
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = $_POST['action'] ?? '';
        $csrfOk = isset($_POST['csrf']) && hash_equals($_SESSION['csrf'], (string)$_POST['csrf']);
        if (!$csrfOk) { http_response_code(403); exit('Invalid request.'); }

        if ($action === 'login') {
            $u = (string)($_POST['username'] ?? '');
            $p = (string)($_POST['password'] ?? '');
            if (hash_equals((string)$config['dash_user'], $u) && password_verify($p, (string)$config['dash_pass_hash'])) {
                session_regenerate_id(true);
                $_SESSION['auth'] = true;
                $_SESSION['last'] = time();
                $_SESSION['csrf'] = bin2hex(random_bytes(32));
                header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
                exit;
            }
            $loginError = 'Invalid username or password.';
        }
    }

    // ---- Auth gate ----
    if (empty($_SESSION['auth'])) {
        echo '<!doctype html><html><head><meta charset="utf-8"><title>Launch Reset — Login</title>';
        echo '<style nonce="' . $nonce . '">
            :root{--bg:#f5f6f8;--card:#fff;--text:#1c2330;--line:#e5e7eb;--accent:#2563eb}
            *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--text)}
            .login{max-width:340px;margin:12vh auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:24px}
            .login input{width:100%;margin-bottom:12px}.err{color:#dc2626;margin-bottom:12px}
        </style></head><body>';
        echo '<form class="login" method="post"><h2>Launch Reset Access</h2>';
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
}

// ---- Helper: render HTML page ----
function pageStart(string $title, string $nonce): void {
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<meta name="robots" content="noindex,nofollow"><title>' . h($title) . '</title>';
    echo '<style nonce="' . $nonce . '">
        :root{--bg:#f5f6f8;--card:#fff;--text:#1c2330;--muted:#6b7280;--line:#e5e7eb;--accent:#2563eb;--red:#dc2626}
        *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--text)}
        header{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:var(--card);border-bottom:1px solid var(--line)}
        header h1{font-size:17px;margin:0}header a{color:var(--muted);text-decoration:none}
        main{max-width:900px;margin:24px auto;padding:0 16px}
        .card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:20px;margin-bottom:20px}
        .bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        button,.btn{font:inherit;padding:8px 16px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text);cursor:pointer}
        .btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}
        .btn.danger{background:var(--red);border-color:var(--red);color:#fff}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);font-size:13px}
        th{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
        tr:last-child td{border-bottom:0}
        .stat{display:flex;gap:8px;align-items:center}
        .stat b{font-size:20px;font-weight:600}
        .ok{color:var(--accent)}
        .warn{color:#d97706}
    </style></head><body>
    <header><h1>BigFix Launch Reset</h1>
    <a href="analytics.php">Analytics</a> | <a href="dashboard.php">Dashboard</a></header>
    <main>';
}

function pageEnd(): void {
    echo '</main></body></html>';
}

// ---- Handle reset actions ----
$confirm = isset($_GET['confirm']) && $_GET['confirm'] === 'yes';
$resetResult = null;

if (!$isCli && isset($_POST['action']) && $_POST['action'] === 'reset') {
    // CSRF check
    if (!isset($_POST['csrf']) || !hash_equals($_SESSION['csrf'], (string)$_POST['csrf'])) {
        http_response_code(403);
        exit('Invalid request.');
    }
    $confirm = true;
}

if ($confirm) {
    try {
        $db = pdo($config);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $report = [];
        $totalRows = 0;

        // 1. Disable FK checks (for clean truncate of related tables)
        $db->exec('SET FOREIGN_KEY_CHECKS = 0');
        $report[] = ['table' => 'foreign_key_checks', 'rows_deleted' => 'OFF', 'note' => 'Disabled for clean truncate'];

        // 2. Truncate tracking_tables first
        foreach (['tracking_events', 'tracking_sessions', 'submissions'] as $table) {
            $count = 0;
            try {
                $r = $db->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                $count = (int)$r;
            } catch (Throwable $e) {
                // table might not exist
            }
            if ($count > 0) {
                $db->exec("TRUNCATE TABLE `$table`");
                $totalRows += $count;
                $report[] = ['table' => $table, 'rows_deleted' => $count, 'note' => 'TRUNCATE'];
            } else {
                $report[] = ['table' => $table, 'rows_deleted' => 0, 'note' => 'Already empty'];
            }
        }

        // 3. Re-enable FK checks
        $db->exec('SET FOREIGN_KEY_CHECKS = 1');
        $report[] = ['table' => 'foreign_key_checks', 'rows_deleted' => 'ON', 'note' => 'Re-enabled'];

        // 4. Clear tracking cache files
        $cacheDirs = [
            __DIR__ . '/../cache',
            __DIR__ . '/../api/cache',
        ];
        $cacheCleared = [];
        foreach ($cacheDirs as $dir) {
            if (is_dir($dir)) {
                $files = glob($dir . '/*');
                $count = 0;
                foreach ($files as $f) {
                    if (is_file($f) && @unlink($f)) $count++;
                }
                if ($count > 0) $cacheCleared[] = "$dir: $count files";
            }
        }
        $report[] = ['table' => 'cache', 'rows_deleted' => 0, 'note' => implode(', ', $cacheCleared) ?: 'No cache files found'];

        // 5. Check for login throttle files
        $loginThrottle = glob(sys_get_temp_dir() . '/bf_login_*.json');
        $throttleCount = 0;
        foreach ($loginThrottle as $f) { if (@unlink($f)) $throttleCount++; }
        $report[] = ['table' => 'login_throttle', 'rows_deleted' => $throttleCount, 'note' => 'Throttle files cleared'];

        $resetResult = [
            'success' => true,
            'total_rows_deleted' => $totalRows,
            'details' => $report,
        ];
    } catch (Throwable $e) {
        $resetResult = [
            'success' => false,
            'error' => $e->getMessage(),
        ];
    }
}

// ---- Render page ----
if ($isCli) {
    // CLI output
    if ($resetResult !== null) {
        echo json_encode($resetResult, JSON_PRETTY_PRINT) . "\n";
    } else {
        echo "Run with ?confirm=yes (HTTP) or set POST action=reset (browser).\n";
    }
    exit;
}

pageStart('Launch Reset', $nonce);

if ($resetResult !== null && $resetResult['success']) {
    echo '<div class="card" style="border-color:var(--accent)">';
    echo '<h2 style="color:var(--accent)">✅ Launch Reset Complete</h2>';
    echo '<p><strong>' . number_format($resetResult['total_rows_deleted']) . ' rows</strong> deleted across all tables.</p>';
    echo '<table><thead><tr><th>Table</th><th>Rows Deleted</th><th>Notes</th></tr></thead><tbody>';
    foreach ($resetResult['details'] as $r) {
        echo '<tr><td>' . h($r['table']) . '</td><td>' . (is_numeric($r['rows_deleted']) ? number_format($r['rows_deleted']) : h($r['rows_deleted'])) . '</td><td>' . h($r['note']) . '</td></tr>';
    }
    echo '</tbody></table>';
    echo '<div class="bar"><a class="btn" href="analytics.php">Analytics Dashboard</a> <a class="btn" href="dashboard.php">Submissions Dashboard</a></div>';
    echo '</div>';
} elseif ($resetResult !== null) {
    echo '<div class="card" style="border-color:var(--red)">';
    echo '<h2 style="color:var(--red)">❌ Reset Failed</h2>';
    echo '<p>' . h($resetResult['error']) . '</p></div>';
}

// Confirmation form (if not yet reset)
if ($resetResult === null) {
    echo '<div class="card" style="border-color:var(--red)">';
    echo '<h2 style="color:var(--red)">⚠️ Launch Reset</h2>';
    echo '<p>This will permanently delete ALL analytics and submission data:</p>';
    echo '<ul style="margin-left:20px">';
    echo '<li><strong>tracking_sessions</strong> — all visitor sessions</li>';
    echo '<li><strong>tracking_events</strong> — all page views, clicks, scrolls, form events</li>';
    echo '<li><strong>submissions</strong> — all form submissions (contact, book_demo, home_review)</li>';
    echo '<li><strong>cache/</strong> — tracking cache and rate-limit files</li>';
    echo '<li><strong>login throttle</strong> — failed login attempt tracking</li>';
    echo '</ul>';
    echo '<p style="color:var(--muted)">This action cannot be undone. The database will be completely empty after this operation.</p>';
    echo '<form method="POST" onsubmit="return confirm(\'Are you absolutely sure? This will delete ALL data. There is no undo.\')">';
    echo '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf'] ?? '') . '">';
    echo '<input type="hidden" name="action" value="reset">';
    echo '<div class="bar">';
    echo '<button type="button" class="btn" onclick="window.location.href=localStorage.getItem(\'ref\')||document.referrer">← Go Back</button>';
    echo '<button type="submit" class="btn danger">Reset Database — I Understand the Consequences</button>';
    echo '</div></form>';
    echo '</div>';
}

pageEnd();
