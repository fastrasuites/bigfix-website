<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('log_errors', '1');

echo "=== Testing init.php execution ===\n";

// We can't use exec or shell_exec, so let's test by trying to include the file
// But we'll wrap it in error handling

// First, test if we can token_get_all (parse PHP file)
$code = file_get_contents(__DIR__ . '/init.php');
$tokens = @token_get_all($code);
if ($tokens === false) {
    echo "FATAL: init.php has a syntax error that prevents tokenization\n";
} else {
    echo "init.php tokenized successfully (" . count($tokens) . " tokens)\n";
}

// Try to parse the file using the tokenizer
$hasError = false;
$errorMsg = "";
try {
    // This will throw if there's a syntax error
    $tokens = token_get_all($code);
    echo "Token parsing: OK\n";
} catch (\Throwable $e) {
    $hasError = true;
    $errorMsg = $e->getMessage();
    echo "Token parsing error: $errorMsg\n";
}

echo "\n=== Done ===\n";
