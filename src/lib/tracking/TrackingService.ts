/**
 * BigFix Tracking Service - Core tracking logic
 * Singleton service that handles all tracking operations
 * Can be used both in React components and vanilla JS
 */

import type {
  TrackEvent,
  TrackEventData,
  EventType,
  SessionInitResult,
  EventsResult,
  IdentifyData,
  IdentifyResult,
  ExitIntentData,
  ExitIntentResult,
  CleanupResult,
  EnrichmentResult,
  UTMData,
  PageData,
  SessionInitResult,
  EventsResult,
  IdentifyResult,
  ExitIntentResult,
  CleanupResult,
  EnrichmentResult,
  EnrichmentData,
  GeoData,
  TrackingConfig,
} from './types';

/**
 * Default configuration
 */
const DEFAULT_CONFIG = {
  apiBase: '/api/tracking',
  sessionCookieName: 'tracking_sid',
  sessionCookieMaxAge: 31536000, // 1 year
  batchInterval: 5000, // 5 seconds
  maxBatchSize: 50,
  scrollThrottleMs: 500,
  scrollDepthThresholds: [25, 50, 75, 90, 100],
  exitIntentThreshold: 20, // pixels from top for mouseleave
  scrollUpThreshold: 100, // pixels scrolled up for mobile
  respectDNT: true,
  debug: false,
};

/**
 * TrackingService - Singleton class for all tracking operations
 * Handles session management, event batching, API communication
 */
export class TrackingService {
  private static instance: TrackingService;
  private config: typeof DEFAULT_CONFIG;
  private state: {
    sessionId: string | null;
    eventQueue: any[];
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
  };

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.state = {
      sessionId: null,
      eventQueue: [],
      batchTimer: null,
      scrollDepthReached: new Set(),
      lastScrollY: 0,
      lastScrollTime: Date.now(),
      pageStartTime: Date.now(),
      pageviewSent: false,
      isInitialized: false,
      consentGiven: false,
      exitIntentTriggered: false,
      exitIntentPopupShown: false,
    };
  }

  static getInstance(): TrackingService {
    if (!TrackingService.instance) {
      TrackingService.instance = new TrackingService();
    }
    return TrackingService.instance;
  }

  /**
   * Configure the tracking service
   */
  configure(config: Partial<typeof DEFAULT_CONFIG>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): typeof DEFAULT_CONFIG {
    return { ...this.config };
  }

  /**
   * Get current state (for debugging)
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Generate UUID v4
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Cookie helpers
   */
  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; secure; samesite=lax`;
  }

  /**
   * Get or create session ID
   */
  getSessionId(): string {
    if (this.state.sessionId) return this.state.sessionId;
    
    const cookieId = this.getCookie(this.config.sessionCookieName);
    if (cookieId) {
      this.state.sessionId = cookieId;
      return cookieId;
    }

    this.state.sessionId = this.generateUUID();
    this.setCookie(this.config.sessionCookieName, this.state.sessionId, this.config.sessionCookieMaxAge);
    return this.state.sessionId;
  }

  /**
   * Get UTM parameters from URL
   */
  private getUTMParams(): URLSearchParams {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }

  private getUTMData() {
    if (typeof window === 'undefined') {
      return { utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_content: params.get('utm_content'),
      utm_term: params.get('utm_term'),
    };
  }

  private getPageData() {
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
   * Build event object
   */
  private buildEvent(type: string, data: Record<string, any> = {}): any {
    const pageData = this.getPageData();
    const utmData = this.getUTMData();
    return {
      type,
      url: pageData.url,
      title: pageData.title,
      referrer: pageData.referrer,
      data: { ...utmData, ...data },
      time_on_page: Math.round((Date.now() - this.state.pageStartTime) / 1000),
      scroll_depth: this.getScrollDepth(),
    };
  }

  private getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  /**
   * Event queue management
   */
  private enqueueEvent(event: any): void {
    if (this.state.eventQueue.length >= this.config.maxBatchSize) {
      this.log('Queue full, dropping oldest event');
      this.state.eventQueue.shift();
    }
    this.state.eventQueue.push(event);
  }

  private sendBatch(): void {
    if (this.state.eventQueue.length === 0) return;

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);
    const sessionId = this.getSessionId();

    const payload = {
      session_id: this.getSessionId(),
      events,
    };

    const useBeacon = typeof document !== 'undefined' && document.visibilityState === 'hidden';
    const url = `${this.config.apiBase}/events.php`;

    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(`${this.config.apiBase}/events.php`, blob);
    } else {
      fetch(`${this.config.apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(err => this.log('Send error:', err));
    }
  }

  private scheduleBatch(): void {
    if (this.state.batchTimer) clearTimeout(this.state.batchTimer);
    this.state.batchTimer = setTimeout(() => {
      this.sendBatch();
      this.scheduleBatch();
    }, this.config.batchInterval);
  }

  /**
   * Logging
   */
  private log(...args: any[]): void {
    if (this.config.debug) console.log('[TrackingService]', ...args);
  }

  /**
   * Session initialization
   */
  async initSession(): Promise<{ sessionId: string }> {
    const utmParams = new URLSearchParams(this.getUTMData());
    const url = `${this.config.apiBase}/session/init.php?${this.getUTMParams().toString()}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.session_id) {
        this.state.sessionId = data.session_id;
        if (typeof document !== 'undefined') {
          document.cookie = `${this.config.sessionCookieName}=${data.session_id}; max-age=${this.config.sessionCookieMaxAge}; path=/; secure; samesite=lax`;
        }
        this.log('Session initialized:', data.session_id);
        return { sessionId: data.session_id };
      }
      throw new Error(data.error || 'Session init failed');
    } catch (err) {
      this.log('Session init error:', err);
      // Fallback to local session ID
      const sessionId = this.getSessionId();
      return { sessionId };
    }
  }

  /**
   * Send batched events
   */
  async sendEvents(): Promise<{ accepted: number; dropped: number }> {
    if (this.state.eventQueue.length === 0) return { accepted: 0, dropped: 0 };

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);
    const sessionId = this.getSessionId();

    try {
      const response = await fetch(`${this.config.apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: this.getSessionId(), events }),
        keepalive: true,
      });

      const data = await response.json();
      return { accepted: data.accepted || 0, dropped: data.dropped || 0 };
    } catch (err) {
      this.log('Send events error:', err);
      // Re-queue events on failure
      this.state.eventQueue.unshift(...this.state.eventQueue.splice(0, this.config.maxBatchSize));
      return { accepted: 0, dropped: this.config.maxBatchSize };
    }
  }

  /**
   * Enqueue event
   */
  trackEvent(type: string, data: Record<string, any> = {}): void {
    const event = this.buildEvent(type, data);
    this.enqueueEvent(event);
  }

  /**
   * Build event with page/UTM data
   */
  private buildEvent(type: string, data: Record<string, any> = {}): any {
    if (typeof window === 'undefined') {
      return { type, url: '', title: '', referrer: '', data: {}, time_on_page: 0, scroll_depth: 0 };
    }

    const pageData = this.getPageData();
    const utmData = this.getUTMData();
    return {
      type,
      url: pageData.url,
      title: pageData.title,
      referrer: pageData.referrer,
      data: { ...utmData, ...data },
      time_on_page: Math.round((Date.now() - this.state.pageStartTime) / 1000),
      scroll_depth: this.getScrollDepth(),
    };
  }

  /**
   * Get scroll depth
   */
  private getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  /**
   * Identify user (link session to submission/user)
   */
  async identify(data: {
    submission_id?: number | null;
    user_id?: number | null;
    email: string;
    phone?: string;
  }): Promise<any> {
    const sessionId = this.getSessionId();

    try {
      const response = await fetch(`${this.config.apiBase}/identify.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.getSessionId(),
          submission_id: data.submission_id || null,
          user_id: data.user_id || null,
          email: data.email,
          phone: data.phone || '',
        }),
      });

      return await response.json();
    } catch (err) {
      this.log('Identify error:', err);
      return { success: false, error: 'Identify failed' };
    }
  }

  /**
   * Capture exit intent
   */
  async captureExitIntent(email: string, phone: string, exitType: string): Promise<any> {
    const sessionId = this.getSessionId();

    try {
      const response = await fetch(`${this.config.apiBase}/exit-intent.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: this.getSessionId(),
          email,
          phone,
          exit_type: exitType,
        }),
      });

      return await response.json();
    } catch (err) {
      this.log('Exit intent capture error:', err);
      return { success: false, error: 'Exit intent capture failed' };
    }
  }

/**
   * Send batched events
   */
  private sendBatch(): void {
    if (this.state.eventQueue.length === 0) return;

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);
    const payload = {
      session_id: this.getSessionId(),
      events,
    };

    const useBeacon = typeof document !== 'undefined' && document.visibilityState === 'hidden';

    if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify({ session_id: this.getSessionId(), events })], { type: 'application/json' });
      navigator.sendBeacon(`${this.config.apiBase}/events.php`, blob);
    } else {
      fetch(`${this.config.apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: this.getSessionId(), events }),
        keepalive: true,
      }).catch((err: Error) => this.log('Send error:', err));
    }
  }

  /**
   * Schedule batch sending
   */
  private scheduleBatch(): void {
    if (this.state.batchTimer) clearTimeout(this.state.batchTimer);
    this.state.batchTimer = setTimeout(() => {
      this.sendBatch();
      this.scheduleBatch();
    }, this.config.batchInterval);
  }

  /**
   * Get scroll depth
   */
  private getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  /**
   * Initialize tracking
   */
  async initialize(): Promise<void> {
    if (this.state.isInitialized) return;

    if (typeof window === 'undefined') return;

    // Check DNT
    if (this.config.respectDNT && (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1')) {
      this.log('Do Not Track enabled, tracking disabled');
      return;
    }

    // Initialize session
    await this.initSession();

    // Start batch timer
    this.scheduleBatch();

    // Set up event listeners
    this.setupEventListeners();

    this.state.isInitialized = true;
    this.log('Tracking service initialized');
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendBatch();
      }
    });

    // Before unload
    window.addEventListener('beforeunload', () => {
      this.sendBatch();
    });

    // Page load - initial pageview
    this.trackPageView();

    // SPA navigation
    if (window.history && window.history.pushState) {
      const originalPushState = history.pushState.bind(history);
      history.pushState = (...args) => {
        originalPushState.apply(history, args);
        this.handleRouteChange();
      };

      const originalReplaceState = history.replaceState.bind(history);
      history.replaceState = (...args) => {
        originalReplaceState.apply(history, args);
        this.handleRouteChange();
      };

      window.addEventListener('popstate', () => this.handleRouteChange());
    }
  }

  private handleRouteChange(): void {
    this.state.pageviewSent = false;
    this.state.pageStartTime = Date.now();
    this.state.scrollDepthReached.clear();
    this.trackPageView();
  }

  /**
   * Track page view
   */
  trackPageView(data?: Record<string, any>): void {
    if (this.state.pageviewSent) return;
    this.state.pageviewSent = true;
    this.state.pageStartTime = Date.now();
    this.state.scrollDepthReached.clear();
    this.state.lastScrollY = window.scrollY || 0;
    this.state.lastScrollTime = Date.now();

    this.trackEvent('pageview', {
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...data,
    });
  }

  /**
   * Track click event
   */
  trackClick(data: Record<string, any>): void {
    this.trackEvent('click', data);
  }

  /**
   * Track scroll event
   */
  trackScroll(data: Record<string, any>): void {
    this.trackEvent('scroll', data);
  }

  /**
   * Generic event tracking
   */
  trackEvent(type: string, data: Record<string, any> = {}): void {
    const event = this.buildEvent(type, data);
    this.enqueueEvent(event);
  }

  /**
   * Identify user (link session to submission/user)
   */
  async identify(data: { submission_id?: number | null; user_id?: number | null; email: string; phone?: string }): Promise<any> {
    const sessionId = this.getSessionId();

    try {
      const response = await fetch(`${this.config.apiBase}/identify.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          submission_id: data.submission_id || null,
          user_id: data.user_id || null,
          email: data.email,
          phone: data.phone || '',
        }),
      });

      return await response.json();
    } catch (err) {
      this.log('Identify error:', err);
      return { success: false, error: 'Identify failed' };
    }
  }

  /**
   * Trigger exit intent
   */
  triggerExitIntent(type: string): void {
    if (this.state.exitIntentTriggered) return;
    this.state.exitIntentTriggered = true;

    this.trackEvent('exit_intent', { exit_type: type });

    // Notify server
    fetch(`${this.config.apiBase}/exit-intent.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: this.getSessionId(), exit_type: type }),
      keepalive: true,
    }).catch(() => {});

    // Trigger exit intent popup if available
    if (typeof window !== 'undefined' && (window as any).ExitIntentPopup) {
      (window as any).ExitIntentPopup.show();
    }
  }

  /**
   * Manual exit intent trigger
   */
  captureExitIntent(email: string, phone: string, exitType: string): Promise<any> {
    return this.captureExitIntent(email, '', exitType);
  }

  /**
   * Set consent
   */
  setConsent(given: boolean): void {
    if (typeof document !== 'undefined') {
      localStorage.setItem('tracking_consent', given ? 'true' : 'false');
      document.cookie = `tracking_consent=${given ? 'true' : 'false'}; max-age=31536000; path=/; secure; samesite=lax`;
    }
  }

  getConsent(): boolean {
    if (typeof document === 'undefined') return false;
    const consent = localStorage.getItem('tracking_consent') || this.getCookie('tracking_consent');
    return consent === 'true' || consent === '1';
  }

  getSessionId(): string | null {
    return this.state.sessionId;
  }

  isReady(): boolean {
    return this.state.isInitialized;
  }

  /**
   * Check if tracking is allowed (DNT, consent)
   */
  isTrackingAllowed(): boolean {
    if (this.config.respectDNT && (navigator.doNotTrack === '1' || (window as any).doNotTrack === '1')) {
      return false;
    }
    // Check consent (implement based on your consent system)
    return true;
  }
}

export default TrackingService;