/**
 * BigFix Absolute Tracking - TypeScript Type Definitions
 * 
 * Type-safe definitions for all tracking types.
 * No `any` types - everything is strictly typed.
 */

// ============================================================
// Event Types
// ============================================================

export type EventType =
  | 'pageview'
  | 'click'
  | 'scroll'
  | 'form_start'
  | 'form_submit'
  | 'view_pricing'
  | 'view_demo'
  | 'click_whatsapp'
  | 'exit_intent_triggered'
  | 'exit_intent_converted'
  | 'gated_view';

export type ExitIntentType = 'mouseleave' | 'scroll_up' | 'back_button' | 'blur';

export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'bot';

export type IdentifySource = 'form_submit' | 'exit_intent' | 'whatsapp' | 'manual';

// ============================================================
// Tracking Event Interface
// ============================================================

export interface TrackingEvent {
  event_type: EventType;
  page_url: string;
  page_title?: string;
  element_selector?: string;
  element_text?: string;
  scroll_depth?: number;
  time_on_page?: number;
  event_data?: Record<string, string | number | boolean | null>;
}

// ============================================================
// Session Data Interface
// ============================================================

export interface SessionData {
  session_id: string;
  company_name?: string;
  is_b2b: boolean;
}

export interface SessionInitResponse {
  success: boolean;
  session_id: string;
  company_name: string;
  is_b2b: boolean;
}

// ============================================================
// UTM Parameters Interface
// ============================================================

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

// ============================================================
// Device Info Interface
// ============================================================

export interface DeviceInfo {
  device_type: DeviceType;
  device_brand: string;
  device_model: string;
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
}

// ============================================================
// Geo/IP Data Interface
// ============================================================

export interface GeoData {
  country_code: string;
  country_name: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  org: string;
  company_name: string;
  is_b2b: boolean;
  b2b_confidence: number;
}

// ============================================================
// Identify Request/Response Interfaces
// ============================================================

export interface IdentifyRequest {
  session_id: string;
  email: string;
  phone?: string;
  source?: IdentifySource;
}

export interface IdentifyResponse {
  success: boolean;
  session_id: string;
  email: string;
  error?: string;
}

// ============================================================
// Exit Intent Interfaces
// ============================================================

export interface ExitIntentData {
  email: string;
  phone: string;
  exit_type: ExitIntentType;
}

export interface ExitIntentResponse {
  success: boolean;
  error?: string;
}

// ============================================================
// Events Response Interface
// ============================================================

export interface EventsBatchResponse {
  success: boolean;
  accepted: number;
  dropped: number;
  error?: string;
}

// ============================================================
// Tracker Configuration
// ============================================================

export interface TrackerConfig {
  apiBase: string;
  sessionCookieName: string;
  sessionCookieMaxAge: number;
  batchInterval: number;
  maxBatchSize: number;
  scrollThrottleMs: number;
  scrollDepthThresholds: number[];
  respectDNT: boolean;
  respectOptout: boolean;
  debug: boolean;
}

// ============================================================
// Tracker State (internal)
// ============================================================

export interface TrackerState {
  sessionId: string | null;
  isInitialized: boolean;
  sessionReady: boolean;
  eventQueue: TrackingEvent[];
  viewPricingCount: number;
  identified: boolean;
  exitIntentTriggered: boolean;
  pageStartTime: number;
}

// ============================================================
// Toast Type for UI Notifications
// ============================================================

export type ToastType = 'success' | 'error' | 'info';

export interface ToastConfig {
  type: ToastType;
  message: string;
  duration: number;
}
