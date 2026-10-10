/**
 * BigFix Tracking - TypeScript Types
 * Centralized type definitions for the tracking system
 */

export type EventType = 
  | 'pageview'
  | 'click'
  | 'scroll'
  | 'form_start'
  | 'form_submit'
  | 'form_abandon'
  | 'download'
  | 'exit_intent'
  | 'exit_intent_submit';

export interface TrackEventData {
  [key: string]: any;
}

export interface PageViewData extends TrackEventData {
  screen_width?: number;
  screen_height?: number;
  viewport_width?: number;
  viewport_height?: number;
}

export interface ClickData extends TrackEventData {
  element: string;
  selector?: string;
  text?: string;
  href?: string | null;
  position?: { x: number; y: number };
}

export interface ScrollData extends TrackEventData {
  depth: number;
  direction: 'up' | 'down';
}

export interface FormStartData extends TrackEventData {
  form_id?: string | null;
  form_action?: string | null;
  form_method?: string;
}

export interface FormSubmitData extends TrackEventData {
  form_id?: string | null;
  form_action?: string | null;
}

export interface FormAbandonData extends TrackEventData {
  form_id?: string | null;
}

export interface DownloadData extends TrackEventData {
  file_name: string;
}

export interface ExitIntentData extends TrackEventData {
  exit_type: 'mouseleave' | 'scroll_up' | 'back_button' | 'blur';
}

export interface ExitIntentSubmitData extends TrackEventData {
  email: string;
  phone?: string;
  exit_type: string;
}

export interface TrackEvent {
  type: EventType;
  url: string;
  title: string;
  referrer: string;
  data: TrackEventData;
  time_on_page: number;
  scroll_depth: number;
}

export interface UTMData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
}

export interface PageData {
  url: string;
  title: string;
  referrer: string;
}

export interface SessionData {
  session_id: string;
  expires_in: number;
}

export interface IdentifyData {
  session_id: string;
  submission_id?: number | null;
  user_id?: number | null;
  email: string;
  phone?: string;
}

export interface ExitIntentData {
  session_id: string;
  email: string;
  phone?: string;
  exit_type: 'mouseleave' | 'scroll_up' | 'back_button' | 'blur';
}

export interface EnrichmentData {
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  isp: string | null;
  org: string | null;
  is_b2b: boolean;
}

export interface EnrichmentResult {
  success: boolean;
  enriched?: boolean;
  data?: EnrichmentData;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

export interface CleanupResult {
  success: boolean;
  skipped?: boolean;
  result?: string;
  error?: string;
}

export interface SessionInitResult {
  success: boolean;
  session_id?: string;
  expires_in?: number;
  error?: string;
}

export interface EventsResult {
  success: boolean;
  accepted: number;
  dropped: number;
  error?: string;
}

export interface IdentifyResult {
  success: boolean;
  rows_updated: number;
  error?: string;
}

export interface ExitIntentResult {
  success: boolean;
  rows_updated: number;
  error?: string;
}

export interface CleanupResult {
  success: boolean;
  skipped?: boolean;
  result?: string;
  error?: string;
}

export interface EnrichmentResult {
  success: boolean;
  enriched?: boolean;
  data?: EnrichmentData;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

export interface EnrichmentData {
  country: string | null;
  country_code: string | null;
  region: string | null;
  city: string | null;
  isp: string | null;
  org: string | null;
  is_b2b: boolean;
}

export interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  isp: string;
  org: string;
  query: string;
  status: string;
}

export interface EnrichedSession {
  country_code: string | null;
  region: string | null;
  city: string | null;
  isp: string | null;
  org: string | null;
  is_b2b: boolean;
}

export interface TrackingConfig {
  apiBase: string;
  sessionCookieName: string;
  sessionCookieMaxAge: number;
  batchInterval: number;
  maxBatchSize: number;
  scrollThrottleMs: number;
  scrollDepthThresholds: number[];
  exitIntentThreshold: number;
  scrollUpThreshold: number;
  respectDNT: boolean;
  debug: boolean;
}

export interface TrackingState {
  sessionId: string | null;
  eventQueue: TrackEvent[];
  batchTimer: ReturnType<typeof setTimeout> | null;
  scrollDepthReached: Set<number>;
  lastScrollY: number;
  lastScrollTime: number;
  pageStartTime: number;
  pageviewSent: boolean;
  isInitialized: boolean;
  consentGiven: boolean;
  exitIntentTriggered: boolean;
  exitIntentPopupShown: boolean;
}

export interface TrackerConfig {
  apiBase: string;
  sessionCookieName: string;
  sessionCookieMaxAge: number;
  batchInterval: number;
  maxBatchSize: number;
  scrollThrottleMs: number;
  scrollDepthThresholds: number[];
  exitIntentThreshold: number;
  scrollUpThreshold: number;
  respectDNT: boolean;
  debug: boolean;
}

export interface TrackerMethods {
  init: () => void;
  identify: (data: IdentifyData) => Promise<any>;
  trackEvent: (type: EventType, data?: TrackEventData) => void;
  trackPageView: () => void;
  trackClick: (data: TrackEventData) => void;
  trackScroll: (data: TrackEventData) => void;
  setConsent: (given: boolean) => void;
  getConsent: () => boolean;
  getSessionId: () => string | null;
  isReady: () => boolean;
  triggerExitIntent: (type: string) => void;
  onExitIntentCaptured: (callback: (data: any) => void) => void;
}

export interface TrackerContextValue {
  trackEvent: (type: string, data?: TrackEventData) => void;
  trackPageView: () => void;
  trackClick: (data: TrackEventData) => void;
  trackScroll: (data: TrackEventData) => void;
  trackFormStart: (formName: string, data?: TrackEventData) => void;
  trackFormSubmit: (formName: string, data?: TrackEventData) => void;
  trackDownload: (fileName: string, data?: TrackEventData) => void;
  trackCTA: (ctaName: string, location: string, data?: TrackEventData) => void;
  identify: (data: IdentifyData) => Promise<any>;
  setConsent: (given: boolean) => void;
  getConsent: () => boolean;
  getSessionId: () => string | null;
  isReady: () => boolean;
  triggerExitIntent: (type: string) => void;
  onExitIntentCaptured: (callback: (data: any) => void) => void;
  trackEvent: (type: string, data?: TrackEventData) => void;
  trackPageView: () => void;
  trackClick: (data: TrackEventData) => void;
  trackScroll: (data: TrackEventData) => void;
}