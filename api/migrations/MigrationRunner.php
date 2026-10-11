<?php
/**
 * Migration Runner - Runs database migrations safely with IF NOT EXISTS
 * Ensures migrations can be re-run without errors
 */
final class MigrationRunner {
  private static ?array $migrations = null;

  private static function getMigrations(): array {
    if (self::$migrations !== null) {
      return self::$migrations;
    }
    self::$migrations = [
      '003_absolute_tracking' => __DIR__ . '/003_absolute_tracking.sql',
    ];
    return self::$migrations;
  }

  public static function runAll(mysqli $conn): void {
    $migrations = self::getMigrations();
    foreach ($migrations as $name => $path) {
      self::runMigration($conn, $name, $path);
    }
  }

  public static function runMigration(mysqli $conn, string $name, string $path): void {
    // Check if migration already ran (by checking for table existence)
    if ($name === '003_absolute_tracking') {
      $stmt = $conn->prepare("SHOW TABLES LIKE 'tracking_sessions'");
      $stmt->execute();
      $result = $stmt->get_result();
      if ($result->fetchColumn()) {
        return; // Table already exists, migration already applied
      }
    }

    $sql = file_get_contents($path);
    if ($sql === false) {
      throw new RuntimeException("Migration file not found: $path");
    }

    // Split SQL into individual statements
    $statements = self::splitSql($sql);

    foreach ($statements as $statement) {
      $statement = trim($statement);
      if ($statement === '' || strpos($statement, '--') === 0) {
        continue;
      }
      $conn->query($statement);
    }

    error_log("Migration $name applied successfully");
  }

  private static function splitSql(string $sql): array {
    $statements = [];
    $lines = explode("\n", $sql);
    $current = '';

    foreach ($lines as $line) {
      $current .= $line . "\n";
      // Check if line ends with semicolon (statement delimiter)
      if (trim($line) !== '' && preg_match('/;\\s*$/', $line)) {
        $statements[] = trim($current);
        $current = '';
      }
    }

    // Handle any remaining statement without trailing semicolon
    $current = trim($current);
    if ($current !== '') {
      $statements[] = $current;
    }

    return $statements;
  }
}
