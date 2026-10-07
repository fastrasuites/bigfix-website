<?php
declare(strict_types=1);

/**
 * BigFix submissions dashboard (read-only).
 * Security: session login with hashed password, CSRF tokens, login throttling,
 * prepared statements, output escaping, strict CSP, idle timeout, CSV formula protection.
 */

$config = require __DIR__ . '/submit-config.php';

// ---- Security headers ---------------------------------------------------
$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'none'; style-src 'nonce-$nonce'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

// ---- Session ------------------------------------------------------------
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_name('bf_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/',
    'secure'   => $https,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

const IDLE_TIMEOUT = 1800;   // 30 minutes
const MAX_FAILS    = 5;
const LOCK_SECONDS = 900;    // 15 minutes

if (!empty($_SESSION['auth']) && time() - ($_SESSION['last'] ?? 0) > IDLE_TIMEOUT) {
    $_SESSION = [];
    session_regenerate_id(true);
}
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

// ---- Helpers ------------------------------------------------------------
function h(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

/** Display a stored value. Decodes entities first so old rows saved HTML-encoded don't double-encode. */
function show(?string $s): string
{
    return h(html_entity_decode((string)$s, ENT_QUOTES, 'UTF-8'));
}

function csrfOk(): bool
{
    return isset($_POST['csrf']) && hash_equals($_SESSION['csrf'], (string)$_POST['csrf']);
}

function throttleFile(): string
{
    return sys_get_temp_dir() . '/bf_login_' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'x') . '.json';
}

function lockRemaining(): int
{
    $f = throttleFile();
    if (!is_file($f)) return 0;
    $d = json_decode((string)file_get_contents($f), true) ?: [];
    if (($d['count'] ?? 0) >= MAX_FAILS) {
        $left = LOCK_SECONDS - (time() - ($d['t'] ?? 0));
        return max(0, $left);
    }
    return 0;
}

function recordFail(): void
{
    $f = throttleFile();
    $d = is_file($f) ? (json_decode((string)file_get_contents($f), true) ?: []) : [];
    if (time() - ($d['t'] ?? 0) >= LOCK_SECONDS) {
        $d = ['count' => 0];
    }
    $d['count'] = ($d['count'] ?? 0) + 1;
    $d['t'] = time();
    file_put_contents($f, json_encode($d), LOCK_EX);
}

function pdo(array $c): PDO
{
    return new PDO(
        "mysql:host={$c['db_host']};dbname={$c['db_name']};charset=utf8mb4",
        $c['db_user'],
        $c['db_pass'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
}

function pageStart(string $title, string $nonce, bool $authed = false): void
{
    $csrf = h($_SESSION['csrf']);
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width,initial-scale=1">';
    echo '<meta name="robots" content="noindex,nofollow"><title>' . h($title) . '</title>';
    echo '<style nonce="' . $nonce . '">
        :root{--bg:#f5f6f8;--card:#fff;--text:#1c2330;--muted:#6b7280;--line:#e5e7eb;--accent:#2563eb}
        @media (prefers-color-scheme:dark){:root{--bg:#0f141b;--card:#171e28;--text:#e6e9ef;--muted:#8b95a5;--line:#263040;--accent:#5b8def}}
        *{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--text)}
        header{display:flex;justify-content:space-between;align-items:center;padding:14px 24px;background:var(--card);border-bottom:1px solid var(--line)}
        header h1{font-size:17px;margin:0}main{max-width:1200px;margin:24px auto;padding:0 16px}
        .cards{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px}
        .stat{flex:1;min-width:140px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
        .stat b{display:block;font-size:24px}.stat span{color:var(--muted);font-size:13px}
        .bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        input,select,button,.btn{font:inherit;padding:8px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--text)}
        button,.btn{cursor:pointer;text-decoration:none;display:inline-block}
        .primary{background:var(--accent);border-color:var(--accent);color:#fff}
        .tablewrap{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}
        table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--line);white-space:nowrap}
        th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}tr:last-child td{border-bottom:0}
        a{color:var(--accent)}.tag{font-size:12px;padding:2px 8px;border-radius:99px;background:var(--bg);border:1px solid var(--line)}
        .pager{display:flex;gap:8px;align-items:center;margin-top:16px;color:var(--muted)}
        .login{max-width:340px;margin:12vh auto;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:24px}
        .login input{width:100%;margin-bottom:12px}.err{color:#dc2626;margin-bottom:12px}
        dl{display:grid;grid-template-columns:140px 1fr;gap:10px 16px;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:20px}
        dt{color:var(--muted)}dd{margin:0;white-space:pre-wrap;word-break:break-word}
        form.inline{display:inline;margin:0}
    </style></head><body>';
    if ($authed) {
        echo '<header><h1>BigFix Submissions</h1><form class="inline" method="post">'
           . '<input type="hidden" name="csrf" value="' . $csrf . '">'
           . '<input type="hidden" name="action" value="logout"><button>Log out</button></form></header>';
    }
}

function pageEnd(): void
{
    echo '</body></html>';
}

// ---- Actions: login / logout -------------------------------------------
$loginError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if (!csrfOk()) {
        http_response_code(403);
        exit('Invalid request. Go back and reload the page.');
    }

    if ($action === 'login') {
        if (($wait = lockRemaining()) > 0) {
            $loginError = 'Too many attempts. Try again in ' . (int)ceil($wait / 60) . ' minute(s).';
        } else {
            $u = (string)($_POST['username'] ?? '');
            $p = (string)($_POST['password'] ?? '');
            $userOk = hash_equals((string)$config['dash_user'], $u);
            $passOk = password_verify($p, (string)$config['dash_pass_hash']);

            if ($userOk && $passOk) {
                @unlink(throttleFile());
                session_regenerate_id(true);
                $_SESSION['auth'] = true;
                $_SESSION['last'] = time();
                $_SESSION['csrf'] = bin2hex(random_bytes(32));
                header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
                exit;
            }
            recordFail();
            $loginError = 'Invalid username or password.';
        }
    } elseif ($action === 'logout') {
        $_SESSION = [];
        session_destroy();
        header('Location: ' . strtok($_SERVER['REQUEST_URI'], '?'));
        exit;
    }
}

// ---- Login screen -------------------------------------------------------
if (empty($_SESSION['auth'])) {
    pageStart('Login', $nonce);
    echo '<form class="login" method="post" autocomplete="off"><h2>Sign in</h2>';
    if ($loginError) echo '<div class="err">' . h($loginError) . '</div>';
    echo '<input type="hidden" name="csrf" value="' . h($_SESSION['csrf']) . '">';
    echo '<input type="hidden" name="action" value="login">';
    echo '<input name="username" placeholder="Username" required autofocus>';
    echo '<input name="password" type="password" placeholder="Password" required>';
    echo '<button class="primary" style="width:100%">Log in</button></form>';
    pageEnd();
    exit;
}

$_SESSION['last'] = time();

// ---- Authenticated: data ------------------------------------------------
try {
    $db = pdo($config);
} catch (PDOException $e) {
    error_log('Dashboard DB error: ' . $e->getMessage());
    http_response_code(500);
    exit('Database connection failed.');
}

$sources = ['contact', 'book_demo', 'home_review'];

// Detail view
if (isset($_GET['id'])) {
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    $row = $id ? $db->prepare('SELECT * FROM submissions WHERE id = :id') : null;
    if ($row) {
        $row->execute([':id' => $id]);
        $row = $row->fetch();
    }
    pageStart('Submission', $nonce, true);
    echo '<main><p><a href="?">&larr; Back to all submissions</a></p>';
    if (!$row) {
        echo '<p>Submission not found.</p>';
    } else {
        echo '<dl>';
        foreach ($row as $k => $v) {
            if ($v === null || $v === '') continue;
            echo '<dt>' . h(ucfirst(str_replace('_', ' ', $k))) . '</dt><dd>' . show((string)$v) . '</dd>';
        }
        echo '</dl>';
    }
    echo '</main>';
    pageEnd();
    exit;
}

// Filters
$source = in_array($_GET['source'] ?? '', $sources, true) ? $_GET['source'] : '';
$q      = mb_substr(trim((string)($_GET['q'] ?? '')), 0, 100);
$page   = max(1, (int)($_GET['page'] ?? 1));
$per    = 25;

$where = [];
$params = [];
if ($source !== '') {
    $where[] = 'source = :source';
    $params[':source'] = $source;
}
if ($q !== '') {
    $like = '%' . addcslashes($q, '%_\\') . '%';
    $or = [];
    foreach (['name', 'email', 'company', 'subject', 'phone'] as $i => $col) {
        $or[] = "$col LIKE :q$i";
        $params[":q$i"] = $like;
    }
    $where[] = '(' . implode(' OR ', $or) . ')';
}
$whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

// CSV export
if (isset($_GET['export'])) {
    $stmt = $db->prepare("SELECT * FROM submissions $whereSql ORDER BY id DESC");
    $stmt->execute($params);

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="submissions-' . date('Ymd-His') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    $first = true;
    while ($r = $stmt->fetch()) {
        if ($first) {
            fputcsv($out, array_keys($r));
            $first = false;
        }
        $r = array_map(function ($v) {
            $v = html_entity_decode((string)$v, ENT_QUOTES, 'UTF-8');
            return ($v !== '' && strpbrk($v[0], "=+-@\t\r") !== false) ? "'" . $v : $v;
        }, $r);
        fputcsv($out, $r);
    }
    fclose($out);
    exit;
}

$cnt = $db->prepare("SELECT COUNT(*) FROM submissions $whereSql");
$cnt->execute($params);
$total = (int)$cnt->fetchColumn();
$pages = max(1, (int)ceil($total / $per));
$page  = min($page, $pages);

$stmt = $db->prepare("
    SELECT id, source, name, email, phone, company, subject, product, created_at
    FROM submissions $whereSql
    ORDER BY id DESC
    LIMIT :lim OFFSET :off
");
foreach ($params as $k => $v) $stmt->bindValue($k, $v);
$stmt->bindValue(':lim', $per, PDO::PARAM_INT);
$stmt->bindValue(':off', ($page - 1) * $per, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll();

$counts = array_fill_keys($sources, 0);
foreach ($db->query('SELECT source, COUNT(*) c FROM submissions GROUP BY source') as $r) {
    if (isset($counts[$r['source']])) $counts[$r['source']] = (int)$r['c'];
}

$qs = fn(array $extra = []) => '?' . http_build_query(array_filter(
    array_merge(['source' => $source, 'q' => $q], $extra),
    fn($v) => $v !== '' && $v !== null
));

// ---- Render list --------------------------------------------------------
pageStart('Submissions', $nonce, true);
echo '<main><div class="cards">';
echo '<div class="stat"><b>' . array_sum($counts) . '</b><span>Total</span></div>';
foreach ($counts as $s => $n) {
    echo '<div class="stat"><b>' . $n . '</b><span>' . h(ucwords(str_replace('_', ' ', $s))) . '</span></div>';
}
echo '</div>';

echo '<form class="bar" method="get">';
echo '<input name="q" value="' . h($q) . '" placeholder="Search name, email, company..." maxlength="100">';
echo '<select name="source"><option value="">All sources</option>';
foreach ($sources as $s) {
    echo '<option value="' . h($s) . '"' . ($s === $source ? ' selected' : '') . '>' . h(ucwords(str_replace('_', ' ', $s))) . '</option>';
}
echo '</select><button class="primary">Filter</button>';
echo '<a class="btn" href="?">Reset</a>';
echo '<a class="btn" href="' . h($qs(['export' => 1])) . '">Export CSV</a></form>';

echo '<div class="tablewrap"><table><thead><tr><th>ID</th><th>Received</th><th>Source</th><th>Name</th><th>Email</th><th>Company</th><th>Details</th></tr></thead><tbody>';
if (!$rows) {
    echo '<tr><td colspan="7">No submissions found.</td></tr>';
}
foreach ($rows as $r) {
    echo '<tr><td>' . (int)$r['id'] . '</td>'
       . '<td>' . h($r['created_at']) . '</td>'
       . '<td><span class="tag">' . h($r['source']) . '</span></td>'
       . '<td><a href="?id=' . (int)$r['id'] . '">' . show($r['name']) . '</a></td>'
       . '<td>' . show($r['email']) . '</td>'
       . '<td>' . show($r['company']) . '</td>'
       . '<td>' . show($r['phone'] ?: ($r['subject'] ?: $r['product'])) . '</td></tr>';
}
echo '</tbody></table></div>';

echo '<div class="pager">';
if ($page > 1) echo '<a class="btn" href="' . h($qs(['page' => $page - 1])) . '">&larr; Prev</a>';
echo '<span>Page ' . $page . ' of ' . $pages . ' (' . $total . ' results)</span>';
if ($page < $pages) echo '<a class="btn" href="' . h($qs(['page' => $page + 1])) . '">Next &rarr;</a>';
echo '</div></main>';
pageEnd();
