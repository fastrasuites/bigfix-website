<?php
/**
 * IpEnricher - IP Geolocation and B2B Detection
 * 
 * Uses MaxMind GeoLite2 DB first, fallback to ip-api.com with file cache
 * Provides: country_code, region, city, lat, lon, isp, org, company_name, is_b2b, confidence
 * 
 * Strict types, type-safe, production grade
 */
declare(strict_types=1);

namespace BigFix\Tracking;

/**
 * Result of IP enrichment
 */
/**
 * IP enrichment result constants (compatible with PHP 7.4+)
 */
final class IpEnrichmentResult {
    const SUCCESS = 'success';
    const SKIPPED = 'skipped';
    const FAILED = 'failed';
}

/**
 * IpEnricher class - handles IP geolocation and B2B detection
 * 
 * Priority:
 * 1. MaxMind GeoLite2 DB (api/data/GeoLite2-City.mmdb)
 * 2. ip-api.com with file cache (api/cache/ip_cache.json, 24h TTL, 40 req/min limit)
 */
class IpEnricher {
  private string $dbPath;
  private ?\MaxMind\Db\Reader $reader = null;
  private array $ipCache;
  private int $lastRequestTime = 0;
  private const CACHE_TTL = 86400; // 24 hours
  private const REQUESTS_PER_MIN = 40;
  private const MINIGap = 1.5; // seconds between requests to stay under 40/min

  public function __construct(string $geoDbPath = '') {
    // Path to GeoLite2 City MMDB database
    // If not provided, try default locations
    $this->dbPath = $geoDbPath ?: 
      __DIR__ . '/../data/GeoLite2-City.mmdb';

    // Try to open MaxMind DB
    if (file_exists($this->dbPath)) {
      try {
        $this->reader = new \MaxMind\Db\Reader($this->dbPath);
        error_log("IpEnricher: MaxMind DB loaded from {$this->dbPath}");
      } catch (\Throwable $e) {
        error_log("IpEnricher: MaxMind DB open warning: " . $e->getMessage());
        $this->reader = null;
      }
    }

    // Load/file cache
    $this->ipCache = $this->loadCache();
  }

  private function loadCache(): array {
    $cacheFile = __DIR__ . '/../cache/ip_cache.json';
    $cache = [];

    if (file_exists($cacheFile)) {
      $json = file_get_contents($cacheFile);
      $data = json_decode($json, true);
      if ($data && isset($data['timestamp'], $data['entries'])) {
        $age = time() - $data['timestamp'];
        if ($age < self::CACHE_TTL) {
          $cache = $data['entries'];
          $entryCount = is_array($cache) ? count($cache) : 0;
          error_log("IpEnricher: Loaded {$entryCount} IP cache entries (age: {$age}s)");
        } else {
          error_log("IpEnricher: Cache expired, rebuilding");
          // Clear old cache
          @unlink($cacheFile);
        }
      }
    }

    return $cache;
  }

  private function saveCache(): void {
    $cacheFile = __DIR__ . '/../cache/ip_cache.json';
    $data = [
      'timestamp' => time(),
      'entries' => $this->ipCache,
    ];
    @mkdir(dirname($cacheFile), 0755, true);
    file_put_contents($cacheFile, json_encode($data, JSON_PRETTY_PRINT));
  }

  /**
   * Main enrichment method - get all IP data
   * 
   * @return array[country_code, region, city, lat, lon, isp, org, company_name, is_b2b, confidence]
   */
  public function enrich(string $ip): array {
    // Validate IP
    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_V4 | FILTER_FLAG_NO_PRIV_V6)) {
      return ['', '', '', 0.0, 0.0, '', '', '', false, 0];
    }

    // Skip private/local IPs
    if (
      $ip === '127.0.0.1' || $ip === '::1' ||
      preg_match('/^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/', $ip)
    ) {
      return ['', '', '', 0.0, 0.0, '', '', '', false, 0];
    }

    // Try MaxMind first
    if ($this->reader !== null) {
      $result = $this->tryMaxMind($ip);
      if ($result[0] !== '') {
        return $result;
      }
    }

    // Fallback to ip-api.com
    return $this->tryIpApi($ip);
  }

  private function tryMaxMind(string $ip): array {
    try {
      $record = $this->reader->get($ip);
      
      $countryCode = $record->country->isoCode ?? '';
      $country = $record->country->names['en'] ?? '';
      $region = $record->mostSpecificSubdivision->name ?? '';
      $city = $record->city->names['en'] ?? '';
      $latitude = $record->location->latitude ?? 0.0;
      $longitude = $record->location->longitude ?? 0.0;
      $isp = $record->traits->isp ?? '';
      $organization = $record->traits->organization ?? '';

      // Determine company_name from organization
      $companyName = $this->extractCompanyName($organization);

      // B2B detection
      $isB2B = $this->isB2bOrganization($organization);
      $confidence = $isB2B ? 80 : 50;

      return [
        strtoupper($countryCode),
        $region !== '' ? $region : '',
        $city !== '' ? $city : '',
        (float)$latitude,
        (float)$longitude,
        $isp,
        $organization,
        $companyName,
        $isB2B,
        $confidence,
      ];
    } catch (\Throwable $e) {
      error_log("IpEnricher: MaxMind lookup failed for {$ip}: " . $e->getMessage());
    }

    return ['', '', '', 0.0, 0.0, '', '', '', false, 0];
  }

  private function tryIpApi(string $ip): array {
    // Check file cache first
    $cacheKey = $ip;
    if (isset($this->ipCache[$cacheKey])) {
      $cached = $this->ipCache[$cacheKey];
      if (time() - $cached['timestamp'] < self::CACHE_TTL) {
        return [
          $cached['country_code'] ?? '',
          $cached['region'] ?? '',
          $cached['city'] ?? '',
          (float)($cached['latitude'] ?? 0.0),
          (float)($cached['longitude'] ?? 0.0),
          $cached['isp'] ?? '',
          $cached['org'] ?? '',
          $cached['company_name'] ?? '',
          (bool)($cached['is_b2b'] ?? false),
          (int)($cached['confidence'] ?? 50),
        ];
      }
    }

    // Rate limiting: minimum gap between requests
    $now = microtime(true);
    $elapsed = $now - $this->lastRequestTime;
    if ($elapsed < self::MINIGap) {
      usleep((self::MINIGap - $elapsed) * 1000000);
    }
    $this->lastRequestTime = microtime(true);

    // Call ip-api.com
    $url = "http://ip-api.com/json/{$ip}?status=1&fields=country,countryCode,region,regionName,city,isp,org,query";
    
    $context = stream_context_create([
      'http' => [
        'timeout' => 5,
        'user_agent' => 'BigFix-Tracking/2.0',
      ]
    ]);

    $response = @file_get_contents($url, false, $context);
    $data = [];

    if ($response !== false) {
      $decoded = json_decode($response, true);
      if ($decoded && $decoded['status'] === 'success') {
        $data = $decoded;
      }
    }

    // Cache result
    $countryCode = $data['countryCode'] ?? '';
    $region = $data['regionName'] ?? '';
    $city = $data['city'] ?? '';
    $isp = $data['isp'] ?? '';
    $org = $data['org'] ?? '';

    $companyName = $this->extractCompanyName($org);
    $isB2B = $this->isB2bOrganization($org);
    $confidence = $isB2B ? 80 : 50;

    // Add to cache (limit size for shared hosting)
    $cacheSize = is_array($this->ipCache) ? count($this->ipCache) : 0;
    if ($cacheSize >= 5000) {
      $keys = array_keys($this->ipCache);
      $removeCount = (int)ceil($cacheSize / 2);
      $removeKeys = array_slice($keys, 0, $removeCount);
      foreach ($removeKeys as $oldKey) {
        unset($this->ipCache[$oldKey]);
      }
    }

    $this->ipCache[$cacheKey] = [
      'timestamp' => time(),
      'country_code' => $countryCode,
      'region' => $region,
      'city' => $city,
      'latitude' => $data['latitude'] ?? 0.0,
      'longitude' => $data['longitude'] ?? 0.0,
      'isp' => $isp,
      'org' => $org,
      'company_name' => $companyName,
      'is_b2b' => $isB2B ? 1 : 0,
      'confidence' => $confidence,
    ];
    $this->saveCache();

    return [
      strtoupper($countryCode),
      $region !== '' ? $region : '',
      $city !== '' ? $city : '',
      (float)($data['latitude'] ?? 0.0),
      (float)($data['longitude'] ?? 0.0),
      $isp,
      $org,
      $companyName,
      $isB2B,
      $confidence,
    ];
  }

  /**
   * Extract company name from organization string
   * e.g., "Dangote Industries Ltd" -> "Dangote Industries"
   */
  private function extractCompanyName(string $org): string {
    if ($org === '') return '';

    // Remove common suffixes to get the company name
    $org = $org;
    $suffixes = [
      '/Ltd', '/Limited', '/Company', '/Corp', '/Incorporated', 
      '/Technologies', '/Solutions', '/Systems', '/Group', '/Holdings',
      '/Enterprises', '/LLC', '/Ltd.', 'Ltd', 'Limited', 'Company', 'Corp',
    ];

    $result = $org;
    foreach ($suffixes as $suffix) {
      $pattern = '/' . preg_quote($suffix, '/') . '$/i';
      if (preg_match($pattern, $result)) {
        $result = preg_replace($pattern, '', $result);
        break;
      }
    }

    // Trim whitespace
    $result = trim($result);
    return $result === '' ? $org : $result;
  }

  /**
   * B2B detection using org field parsing
   * 
   * B2B keywords that suggest a company/org:
   * /(ltd|limited|company|corp|incorporated|technologies|solutions|systems|group|holdings|enterprises)/i
   * 
   * Blacklist / exclude ISPs and cloud providers:
   * /(mtn|airtel|glo|9mobile|spectranet|smile|ipNX|cloudflare|amazon|aws|google|microsoft|digitalocean|linode)/i
   * 
   * Returns: [is_b2b, confidence]
   */
  public function isB2bOrganization(string $org): bool {
    if ($org === '') return false;

    $orgLower = strtolower($org);

    // Check for B2B keywords
    $b2bKeywords = '/(ltd|limited|company|corp|incorporated|technologies|solutions|systems|group|holdings|enterprises)/i';
    if (!preg_match($b2bKeywords, $orgLower)) {
      return false; // No business keyword found
    }

    // Check blacklist - exclude if org is an ISP or cloud provider
    $blacklist = '/(mtn|airtel|glo|9mobile|spectranet|smile|ipNX|cloudflare|amazon|aws|google|microsoft|digitalocean|linode)/i';
    if (preg_match($blacklist, $orgLower)) {
      return false; // ISP or cloud provider, not a B2B company
    }

    return true;
  }

  /**
   * Get just the B2B status and confidence for quick checks
   * 
   * @return array[is_b2b: bool, confidence: int]
   */
  public function quickB2B(string $ip): array {
    $result = $this->enrich($ip);
    return [$result[8] ?? false, $result[9] ?? 0];
  }
}