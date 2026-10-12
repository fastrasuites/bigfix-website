/**
 * BigFix Absolute Tracking - Core Tracker
 * 
 * Singleton class that handles all tracking operations:
 * - Session management with UUID v4 (using uuid library)
 * - Device/browser parsing using ua-parser-js
 * - Event batching with 5s flush intervals
 * - SPA support (pushState override + popstate listener)
 * - Do Not Track and opt-out respect
 * - Scroll depth calculation with throttling
 * 
 * Production-grade, type-safe, no `any` types.
 */

import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';
import type {
  TrackingEvent,
  EventType,
  ExitIntentType,
  UTMParams,
  DeviceInfo,
  SessionData,
  SessionInitResponse,
  IdentifyResponse,
  EventsBatchResponse,
  TrackerConfig,
  TrackerState,
} from './types';

/**
 * Default configuration for the tracker
 */
const DEFAULT_CONFIG: TrackerConfig = {
  apiBase: typeof window !== 'undefined' && window.__TRACKING_ENDPOINT__
    ? window.__TRACKING_ENDPOINT__
    : '/api/tracking',
  sessionCookieName: 'tracking_sid',
  sessionCookieMaxAge: 31536000, // 1 year
  batchInterval: 5000, // 5 seconds
  maxBatchSize: 50,
  scrollThrottleMs: 1000,
  scrollDepthThresholds: [25, 50, 75, 90, 100],
  respectDNT: true,
  respectOptout: true,
  debug: false,
};

// Extend Window interface for global tracking config
declare global {
  interface Window {
    __TRACKING_ENDPOINT__?: string;
  }
}

/**
 * Throttle utility - ensures a function is not called more than once per wait period
 */
function throttle<T extends (...args: unknown[]) => unknown>(fn: T, wait: number): T {
  let lastTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const later = () => {
    lastTime = Date.now();
    if (lastArgs !== null) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  return function throttled(...args: Parameters<T>): void {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastTime = now;
      fn(...args);
    } else if (!timeoutId) {
      lastArgs = args;
      timeoutId = setTimeout(later, remaining);
    }
  } as T;
}

/**
 * Tracker - Singleton class for absolute tracking
 * 
 * Usage:
 * ```typescript
 * import { tracker } from '@/lib/tracker/Tracker';
 * 
 * // Initialize on app load
 * tracker.init();
 * 
 * // Track page views (call in route change effect)
 * tracker.trackPageView('/about');
 * 
 * // Track custom events
 * tracker.trackClick({ element: 'cta_button', ... });
 * 
 * // Identify user
 * tracker.identify('user@example.com', '+2348012345678');
 * ```
 */
export class Tracker {
  private static _instance: Tracker | null = null;
  private config: TrackerConfig;
  private state: TrackerState;
  private batchTimer: ReturnType<typeof setInterval> | null = null;
  private internalSessionId: string | null = null;

  private constructor(config?: Partial<TrackerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      sessionId: null,
      isInitialized: false,
      sessionReady: false,
      eventQueue: [],
      viewPricingCount: 0,
      identified: false,
      exitIntentTriggered: false,
      pageStartTime: Date.now(),
    };
  }

  /**
   * Get the singleton Tracker instance
   */
  public static getInstance(config?: Partial<TrackerConfig>): Tracker {
    if (!Tracker._instance) {
      Tracker._instance = new Tracker(config);
    }
    return Tracker._instance;
  }

  /**
   * Configure the tracker
   */
  public configure(config: Partial<TrackerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current device info using ua-parser-js
   */
  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        device_type: 'desktop',
        device_brand: '',
        device_model: '',
        os_name: '',
        os_version: '',
        browser_name: '',
        browser_version: '',
      };
    }

    const userAgent = navigator.userAgent;
    const parser = new UAParser(userAgent);
    const device = parser.getDevice();
    const os = parser.getOS();
    const browser = parser.getBrowser();

    const deviceType: 'desktop' | 'mobile' | 'tablet' | 'bot' =
      device.type === 'mobile' || device.type === 'tablet'
        ? device.type
        : 'desktop';

    return {
      device_type: deviceType,
      device_brand: device.vendor || '',
      device_model: device.model || '',
      os_name: os.name || '',
      os_version: os.version || '',
      browser_name: browser.name || '',
      browser_version: browser.version || '',
    };
  }

  /**
   * Get UTM parameters from current URL
   */
  private getUTMParams(): UTMParams {
    if (typeof window === 'undefined') return {};

    const params = new URLSearchParams(window.location.search);
    const utm: UTMParams = {};

    const keys: (keyof UTMParams)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'];

    for (const key of keys) {
      const value = params.get(key);
      if (value !== null && value !== '') {
        utm[key] = value;
      }
    }

    return utm;
  }

  /**
   * Get current page data
   */
  private getPageData(): { url: string; title: string; referrer: string } {
    if (typeof window === 'undefined') {
      return { url: '', title: '', referrer: '' };
    }

    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    };
  }

  /**
   * Get scroll depth percentage (0-100)
   */
  private getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;

    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  /**
   * Cookie helpers
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; secure; samesite=lax`;
  }

  /**
   * Internal: get or create session ID, persisting to localStorage and cookie
   */
  private ensureSessionId(): string {
    if (this.internalSessionId) return this.internalSessionId;

    // Try localStorage
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('bf_sid');
      if (stored) {
        this.internalSessionId = stored;
        return stored;
      }
    }

    // Try cookie
    const cookie = this.getCookie(this.config.sessionCookieName);
    if (cookie) {
      this.internalSessionId = cookie;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bf_sid', cookie);
      }
      return cookie;
    }

    // Generate new UUID v4
    const newId = uuidv4();
    this.internalSessionId = newId;
    this.setCookie(this.config.sessionCookieName, newId, this.config.sessionCookieMaxAge);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bf_sid', newId);
    }
    return newId;
  }

  /**
   * Check if tracking should be respected (DNT, opt-out)
   */
  private isTrackingAllowed(): boolean {
    if (typeof navigator === 'undefined') return false;

    // Do Not Track
    if (this.config.respectDNT && navigator.doNotTrack === '1') {
      return false;
    }

    // Opt-out check
    if (this.config.respectOptout && typeof localStorage !== 'undefined') {
      const optout = localStorage.getItem('bf_optout');
      if (optout === '1' || optout === 'true') {
        return false;
      }
    }

    return true;
  }

  /**
   * Build event with page and device context
   */
  private buildEvent(
    type: EventType,
    data: Record<string, unknown> = {}
  ): TrackingEvent {
    const pageData = this.getPageData();
    const utmData = this.getUTMParams();
    const deviceInfo = this.getDeviceInfo();

    return {
      event_type: type,
      page_url: pageData.url,
      page_title: pageData.title || undefined,
      element_selector: data.element_selector as string | undefined,
      element_text: data.element_text as string | undefined,
      scroll_depth: this.getScrollDepth(),
      time_on_page: Math.round((Date.now() - this.state.pageStartTime) / 1000),
      event_data: {
        ...utmData,
        device: JSON.stringify(deviceInfo),
        time_on_page: Math.round((Date.now() - this.state.pageStartTime) / 1000),
        scroll_depth: this.getScrollDepth(),
      },
    };
  }

  /**
   * Private enqueue an event
   */
  private enqueueEvent(event: TrackingEvent): void {
    if (!this.isTrackingAllowed()) return;

    this.state.eventQueue.push(event);

    if (this.state.eventQueue.length >= this.config.maxBatchSize) {
      this.flushEvents();
    }
  }

  /**
   * Private: send batched events to the server
   */
  private async flushEvents(): Promise<EventsBatchResponse> {
    if (this.state.eventQueue.length === 0) {
      return { success: true, accepted: 0, dropped: 0 };
    }

    if (!this.isTrackingAllowed()) {
      this.state.eventQueue = [];
      return { success: false, accepted: 0, dropped: 0 };
    }

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);
    const sessionId = this.ensureSessionId();
    const apiBase = this.config.apiBase;

    // Build the API payload
    const payload = {
      session_id: sessionId,
      events: events.map(e => ({
        event_type: e.event_type,
        page_url: e.page_url,
        page_title: e.page_title,
        element_selector: e.element_selector,
        element_text: e.element_text,
        scroll_depth: e.scroll_depth,
        time_on_page: e.time_on_page,
        event_data: e.event_data,
      })),
    };

    if (apiBase === '') {
      // No API configured
      return { success: true, accepted: events.length, dropped: 0 };
    }

    try {
      const response = await fetch(`${apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!response.ok) {
        // Re-queue events on failure
        this.state.eventQueue.unshift(...events);
        return {
          success: false,
          accepted: 0,
          dropped: 0,
          error: `HTTP ${response.status}`,
        };
      }

      const data = await response.json() as EventsBatchResponse;
      return data;
    } catch {
      // Network error - re-queue for retry
      this.state.eventQueue.unshift(...events);
      return {
        success: false,
        accepted: 0,
        dropped: 0,
        error: 'Network error',
      };
    }
  }

  /**
   * Schedule batch flushing
   */
  private scheduleFlush(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.batchTimer = setInterval(() => {
      this.flushEvents();
    }, this.config.batchInterval);
  }

  /**
   * Initialize the tracker - called on app load
   */
  public async init(): Promise<SessionData> {
    if (this.state.isInitialized) {
      return this.getSessionInfo();
    }

    if (!this.isTrackingAllowed()) {
      return { session_id: '', is_b2b: false };
    }

    const sessionId = this.ensureSessionId();
    this.state.pageStartTime = Date.now();

    // Call backend to create/update session
    const sessionInfo = await this.initSession(sessionId);
    this.state.sessionReady = true;
    this.internalSessionId = sessionInfo.session_id;

    // Save to localStorage + cookie
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bf_sid', sessionInfo.session_id);
    }
    this.setCookie(this.config.sessionCookieName, sessionInfo.session_id, this.config.sessionCookieMaxAge);

    // Store session info for B2B display
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bf_session_info', JSON.stringify({
        company_name: sessionInfo.company_name,
        is_b2b: sessionInfo.is_b2b,
      }));
    }

    // Start batch timer
    this.scheduleFlush();

    // Setup event listeners
    this.setupEventListeners();

    this.state.isInitialized = true;

    return sessionInfo;
  }

  /**
   * Initialize session on backend
   */
  private async initSession(localSessionId: string): Promise<SessionInitResponse> {
    const apiBase = this.config.apiBase;
    if (apiBase === '') {
      return {
        success: true,
        session_id: localSessionId,
        company_name: '',
        is_b2b: false,
      };
    }

    const utmParams = this.getUTMParams();
    const pageData = this.getPageData();
    const deviceInfo = this.getDeviceInfo();

    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(utmParams)) {
      if (value !== undefined) {
        params.set(key, value);
      }
    }

    try {
        const response = await fetch(`${apiBase}/session/session.php?${params.toString()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        keepalive: true,
        body: JSON.stringify({
          landing_page: pageData.url,
          referrer: pageData.referrer,
          ...utmParams,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          device: JSON.stringify(deviceInfo),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json() as SessionInitResponse;
      return data;
    } catch {
      return {
        success: true,
        session_id: localSessionId,
        company_name: '',
        is_b2b: false,
      };
    }
  }

  /**
   * Get current session info from localStorage or internal state
   */
  private getSessionInfo(): SessionData {
    const sessionId = this.internalSessionId || this.ensureSessionId();
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('bf_session_info');
      if (stored) {
        try {
          const info = JSON.parse(stored) as { company_name?: string; is_b2b: boolean };
          return {
            session_id: sessionId,
            company_name: info.company_name,
            is_b2b: info.is_b2b,
          };
        } catch {
          // ignore parse error
        }
      }
    }
    return {
      session_id: sessionId,
      company_name: undefined,
      is_b2b: false,
    };
  }

  /**
   * Setup all event listeners for tracking
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Flush on visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushEvents();
      }
    });

    // Flush on beforeunload
    window.addEventListener('beforeunload', () => {
      this.flushEvents();
    });

    // Track scroll depth (throttled)
    let lastScrollY = 0;
    let lastScrollTime = 0;
    const scrollDepthReached = new Set<number>();

    const scrollHandler = throttle(() => {
      const depth = this.getScrollDepth();
      const scrolled = window.scrollY;

      // Dispatch scroll depth threshold events
      for (const threshold of this.config.scrollDepthThresholds) {
        if (depth >= threshold && !scrollDepthReached.has(threshold)) {
          scrollDepthReached.add(threshold);
          this.trackEvent('scroll', {
            scroll_depth: threshold,
            scroll_y: scrolled,
          });
        }
      }

      // Track scroll up for analytics
      if (scrolled < lastScrollY - 100 && Date.now() - lastScrollTime > 1000) {
        lastScrollTime = Date.now();
        this.trackEvent('scroll', { direction: 'up', scroll_y: scrolled });
      }
      lastScrollY = scrolled;
    }, this.config.scrollThrottleMs);

    window.addEventListener('scroll', scrollHandler, { passive: true });

    // Auto-track initial pageview
    this.trackPageView();

    // SPA navigation
    this.setupSPASupport();
  }

  /**
   * SPA support - override pushState/replaceState and listen to popstate
   */
  private setupSPASupport(): void {
    if (typeof window === 'undefined') return;

    const handleRouteChange = (): void => {
      // Wait for DOM to update after route change
      setTimeout(() => {
        this.trackPageView(window.location.pathname);
      }, 100);
    };

    // Override pushState
    const originalPushState = history.pushState.bind(history);
    history.pushState = function(state: unknown, unused: string, url?: string | URL | null) {
      originalPushState(state, unused, url);
      handleRouteChange();
    };

    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = function(state: unknown, _unused: string, url?: string | URL | null) {
      originalReplaceState(state, _unused, url);
      handleRouteChange();
    };

    window.addEventListener('popstate', () => {
      handleRouteChange();
    });
  }

  /**
   * Track a page view event
   */
  public trackPageView(path?: string): void {
    if (!this.state.isInitialized) return;

    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '');

    // Check for pricing page
    if (currentPath.includes('/pricing')) {
      this.state.viewPricingCount += 1;
      this.trackEvent('view_pricing', {
        view_count: this.state.viewPricingCount,
      });
    }

    this.state.pageStartTime = Date.now();
    this.trackEvent('pageview', {
      path: currentPath,
      screen_width: typeof screen !== 'undefined' ? screen.width : 0,
      screen_height: typeof screen !== 'undefined' ? screen.height : 0,
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });
  }

  /**
   * Track a click event
   */
  public trackClick(data: Record<string, unknown>): void {
    this.trackEvent('click', data);
  }

  /**
   * Track a scroll event
   */
  public trackScroll(data: Record<string, unknown>): void {
    this.trackEvent('scroll', data);
  }

  /**
   * Track a form start event
   */
  public trackFormStart(formName: string): void {
    this.trackEvent('form_start', { form_name: formName });
  }

  /**
   * Track a form submit event
   */
  public trackFormSubmit(formName: string): void {
    this.trackEvent('form_submit', { form_name: formName });
  }

  /**
   * Track the WhatsApp click event
   */
  public trackWhatsAppClick(): void {
    this.trackEvent('click_whatsapp', {});
  }

  /**
   * Track a custom event
   */
  public trackCustom(type: EventType, data: Record<string, unknown>): void {
    this.trackEvent(type, data);
  }

  /**
   * Track an event (public for component use)
   * 
   * @param type - Event type
   * @param data - Additional event data
   */
  public trackEvent(type: EventType, data: Record<string, unknown> = {}): void {
    if (!this.isTrackingAllowed() || !this.state.isInitialized) return;

    const event = this.buildEvent(type, data);
    this.enqueueEvent(event);
  }

  /**
   * Identify user - link session to email/phone
   * 
   * @param email User email
   * @param phone User phone (optional)
   * @param source Source of identification
   * @returns Promise resolving to IdentifyResponse
   */
  public async identify(email: string, phone?: string, source: string = 'form_submit'): Promise<IdentifyResponse> {
    const sessionId = this.internalSessionId || this.ensureSessionId();

    if (!sessionId) {
      return { success: false, session_id: '', email, error: 'No session ID' };
    }

    // Track conversion event
    this.trackEvent('exit_intent_converted', {
      email,
      phone: phone || '',
      source,
    });

    // Flush immediately to ensure conversion is captured
    this.flushEvents();

    // Save identification to localStorage + cookie
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bf_identified', 'true');
    }
    this.setCookie('bf_identified', 'true', this.config.sessionCookieMaxAge);
    this.state.identified = true;

    // Send to backend identify endpoint
    const apiBase = this.config.apiBase;
    if (apiBase === '') {
      return { success: true, session_id: sessionId, email };
    }

    try {
      const response = await fetch(`${apiBase}/identify.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        keepalive: true,
        body: JSON.stringify({
          session_id: sessionId,
          email,
          ...(phone ? { phone } : {}),
          source,
        }),
      });

      if (!response.ok) {
        return { success: false, session_id: sessionId, email, error: `HTTP ${response.status}` };
      }

      const data = await response.json() as IdentifyResponse;
      return data;
    } catch (err) {
      return {
        success: false,
        session_id: sessionId,
        email,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  }

  /**
   * Trigger exit intent
   */
  public triggerExitIntent(type: ExitIntentType = 'mouseleave'): void {
    if (this.state.exitIntentTriggered) return;

    this.state.exitIntentTriggered = true;
    this.trackEvent('exit_intent_triggered', { exit_type: type });
  }

  /**
   * Check if user has opted out of tracking
   */
  public isOptedOut(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('bf_optout') === '1' || localStorage.getItem('bf_optout') === 'true';
  }

  /**
   * Opt out of tracking
   */
  public optOut(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('bf_optout', '1');
    }
    this.setCookie('bf_optout', '1', 31536000);
    this.state.isInitialized = false;
    this.flushEvents(); // Flush any pending events
  }

  /**
   * Get current session ID
   */
  public getSessionId(): string | null {
    return this.internalSessionId || this.ensureSessionId();
  }

  /**
   * Check if tracker is ready
   */
  public isReady(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Check if user has been identified
   */
  public isIdentified(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('bf_identified') === 'true' || this.state.identified;
    }
    return this.state.identified;
  }

  /**
   * Flush events immediately
   */
  public flush(): Promise<EventsBatchResponse> {
    return this.flushEvents();
  }
}

/**
 * Singleton instance exported for direct use
 * 
 * Usage:
 * ```typescript
 * import { tracker } from '@/lib/tracker/Tracker';
 * tracker.init();
 * tracker.trackPageView();
 * tracker.trackClick({ element: 'cta_button' });
 * ```
 */
export const tracker = Tracker.getInstance();

export default Tracker;
