<?php
// Debug: show the resolved path
$configFile = __DIR__ . '/../../../submit-config.php';
echo "Path: " . $configFile . "\n";
echo "Exists: " . (is_file($configFile) ? 'yes' : 'no') . "\n";
echo "Real path: " . (realpath($configFile) ? realpath($configFile) : 'NULL') . "\n";
echo "__DIR__: " . __DIR__ . "\n";
$realfile = '/home/bigfixte/public_html/submit-config.php';
echo "Hardcoded path exists: " . (is_file($realfile) ? 'yes' : 'no') . "\n";
