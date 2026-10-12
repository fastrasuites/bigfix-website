<?php
/**
 * DeviceDetector.php - Robust device detection wrapper
 * 
 * Uses matomo/device-detector if composer available,
 * otherwise falls back to a lightweight pure PHP regex-based detector.
 * 
 * Returns: [device_type, brand, model, os_name, os_version, browser_name, browser_version]
 */
declare(strict_types=1);

namespace BigFix\Tracking;

/**
 * Device detection result enum
 */
/**
 * Device detection result constants (compatible with PHP 7.4+)
 */
final class DeviceDetectionResult {
    const DESKTOP = 'desktop';
    const MOBILE = 'mobile';
    const TABLET = 'tablet';
    const BOT = 'bot';
}

/**
 * DeviceDetector class
 * 
 * Priority:
 * 1. matomo/device-detector (via Composer autoload)
 * 2. Lightweight fallback detector (pure PHP, no external dependencies)
 */
class DeviceDetector {
  private ?\Matomo\DeviceDetector $detector = null;
  private bool $composerAvailable = false;

  public function __construct() {
    // Check if composer autoload exists (matomo/device-detector installed)
    $composerAutoload = __DIR__ . '/../../../../vendor/autoload.php';
    if (file_exists($composerAutoload)) {
      try {
        require_once $composerAutoload;
        // Try to instantiate the detector
        $this->detector = new \Matomo\DeviceDetector\DeviceDetector();
        $this->composerAvailable = true;
        error_log("DeviceDetector: matomo/device-detector available");
      } catch (\Throwable $e) {
        error_log("DeviceDetector: composer detector init warning: " . $e->getMessage());
        $this->detector = null;
      }
    }
  }

  /**
   * Detect device from user agent string
   * 
   * @param string $userAgent Full user agent string
   * @return array[device_type, brand, model, os_name, os_version, browser_name, browser_version]
   */
  public function detect(string $userAgent): array {
    // If composer detector available, use it
    if ($this->composerAvailable && $this->detector !== null) {
      return $this->detectWithMatomo($userAgent);
    }

    // Fallback to lightweight regex-based detector
    return $this->detectFallback($userAgent);
  }

  private function detectWithMatomo(string $userAgent): array {
    try {
      $device = $this->detector->detect($userAgent);
      
      $deviceType = $this->mapDeviceType($device->deviceType);
      $brand = $device->brand ?? '';
      $model = $device->model ?? '';
      $osName = $device->os ?? '';
      $osVersion = $device->osVersion ?? '';
      $browserName = $device->name ?? '';
      $browserVersion = $device->version ?? '';

      return [
        $deviceType,
        $brand,
        $model,
        $osName,
        $osVersion,
        $browserName,
        $browserVersion,
      ];
    } catch (\Throwable $e) {
      error_log("DeviceDetector: matomo detection failed: " . $e->getMessage());
    }

    // Fallback
    return $this->detectFallback($userAgent);
  }

  private function mapDeviceType(string $matomoType): string {
    switch (strtolower($matomoType)) {
      case 'tablet':
      case 'mobile':
        return strtolower($matomoType);
      case 'console':
      case 'tv':
        return 'desktop'; // treat consoles as desktop
      default:
        return 'desktop';
    }
  }

  /**
   * Lightweight fallback detector using regex patterns
   * No external dependencies, works on any PHP installation
   */
  private function detectFallback(string $userAgent): array {
    $ua = $userAgent;
    $uaLower = strtolower($ua);

    // Determine device type
    $deviceType = 'desktop'; // default

    // Check for bot patterns first
    $botPatterns = [
      '/bot/',
      '/crawler/',
      '/spider/',
      '/googlebot/',
      '/bingbot/',
      '/robo/',
    ];

    foreach ($botPatterns as $pattern) {
      if (preg_match($pattern, $uaLower)) {
        $deviceType = 'bot';
        break;
      }
    }

    // Check for mobile/tablet
    if ($deviceType !== 'bot') {
      $mobilePatterns = [
        '/android|ipad|playbook|silk/i',
        '/iphone|ipod|blackberry|opera mini|webos|avantree|iemobile/',
      ];

      foreach ($mobilePatterns as $pattern) {
        if (preg_match($pattern, $uaLower)) {
          // iPad is tablet, iPhone is mobile
          if (preg_match('/ipad|playbook/si', $uaLower)) {
            $deviceType = 'tablet';
          } else {
            $deviceType = 'mobile';
          }
          break;
        }
      }
    }

    // Extract brand and model
    $brand = '';
    $model = '';

    // Common brand patterns
    if (preg_match('/(iPhone|iPad|iPod)/i', $ua, $matches)) {
      $brand = 'Apple';
      if (preg_match('/(iPhone\s+\d+|iPad\s+\d+|iPod)/i', $ua)) {
        $model = $matches[0];
      } else {
        $model = 'i' . (str_pos($uaLower, 'phone') !== false ? 'Phone' : (str_pos($uaLower, 'pad') !== false ? 'Pad' : 'Pod'));
      }
    } elseif (preg_match('/(Samsung|Google|Pixel|OnePlus|Xiaomi|Huawei|OPPO|Vivo|LG|Motorola)/i', $ua, $matches)) {
      $brand = $matches[1];
      // Try to extract model
      if (preg_match('/' . $matches[1] . '\s+[\w\d\s]+/i', $ua)) {
        if (preg_match('/' . $matches[1] . '\s+([\w\d\s]+)/i', $ua, $m2)) {
          $model = trim($m2[1]);
        }
      }
    } elseif (preg_match('/(Windows NT|Macintosh|Linux)/i', $ua)) {
      // Desktop browser - extract from user agent
      $brand = 'Desktop';
    }

    // Extract OS
    $osName = '';
    $osVersion = '';

    if (preg_match('/(Windows NT (\d+\.\d+))/i', $ua, $m)) {
      $osName = 'Windows';
      $osVersion = $m[2] ?? '';
    } elseif (preg_match('/(Mac OS X (\d[\_\d\.]+))/i', $ua, $m)) {
      $osName = 'macOS';
      $osVersion = $m[2] ?? '';
      // Convert _ to . for macOS versions
      $osVersion = str_replace('_', '.', $osVersion);
    } elseif (preg_match('/(Android (\d[\_\d\.]+))/i', $ua, $m)) {
      $osName = 'Android';
      $osVersion = $m[2] ?? '';
      $osVersion = str_replace('_', '.', $osVersion);
    } elseif (preg_match('/(iPhone\s+OS (\d[\_\d\.]+))/i', $ua, $m)) {
      $osName = 'iOS';
      $osVersion = $m[2] ?? '';
      $osVersion = str_replace('_', '.', $osVersion);
    }

    // Extract browser
    $browserName = '';
    $browserVersion = '';

    // Chrome/Chromium
    if (preg_match('/(Chrome|CriOS)\/([\d\.]+)/i', $ua, $m)) {
      $browserName = 'Chrome';
      $browserVersion = $m[2] ?? '';
    }
    // Safari (but not Chrome)
    elseif (preg_match('/(Version)\/([\d\.]+).*Safari/i', $ua, $m) && $browserName !== 'Chrome') {
      $browserName = 'Safari';
      $browserVersion = $m[2] ?? '';
    }
    // Firefox
    elseif (preg_match('/(Firefox|MSIE|Trident\/[\d\.]+)/i', $ua, $m)) {
      if (preg_match('/Firefox\/([\d\.]+)/i', $ua, $m2)) {
        $browserName = 'Firefox';
        $browserVersion = $m2[1] ?? '';
      } else {
        $browserName = 'Internet Explorer';
        $browserVersion = '11';
      }
    }

    return [
      $deviceType,
      $brand,
      $model,
      $osName,
      $osVersion,
      $browserName,
      $browserVersion,
    ];
  }
}