<?php
declare(strict_types=1);
header('Content-Type: application/json');
$p = $_GET['pwd'] ?? '';
if ($p !== 'bigfixtest') {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}
echo json_encode(['status' => 'ok', 'php_version' => phpversion()]);
