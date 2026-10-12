/**
 * BigFix Tracking Service - Core tracking logic
 * Singleton service that handles all tracking operations
 * @deprecated Use Tracker from '@/lib/tracker/Tracker' instead
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  EventType,
  TrackEventData,
  UTMData,
  PageData,
  SessionInitResult,
  EventsResult,
  IdentifyData,
  IdentifyResult,
  ExitIntentResult,
  TrackingConfig,
  TrackingState,
} from './types';

const DEFAULT_CONFIG: TrackingConfig = {
  apiBase: '/api/tracking',
  sessionCookieName: 'tracking_sid',
  sessionCookieMaxAge: 31536000,
  batchInterval: 5000,
  maxBatchSize: 50,
  scrollThrottleMs: 500,
  scrollDepthThresholds: [25, 50, 75, 90, 100],
  exitIntentThreshold: 20,
  scrollUpThreshold: 100,
  respectDNT: true,
  debug: false,
};

type TrackEvent = {
  type: EventType;
  url: string;
  title: string;
  referrer: string;
  data: TrackEventData;
  time_on_page: number;
  scroll_depth: number;
};

export class TrackingService {
  private static instance: TrackingService;
  private config: TrackingConfig;
  private state: TrackingState;

  private constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.state = {
      sessionId: null,
      eventQueue: [],
      batchTimer: null,
      scrollDepthReached: new Set(),
      lastScrollY: 0,
      lastScrollTime: 0,
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

  configure(config: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): TrackingConfig {
    return { ...this.config };
  }

  getState(): TrackingState {
    return { ...this.state };
  }

  private generateUUID(): string {
    return uuidv4();
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  private setCookie(name: string, value: string, maxAge: number): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; secure; samesite=lax`;
  }

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

  private getUTMData(): UTMData {
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

  private getPageData(): PageData {
    if (typeof window === 'undefined') {
      return { url: '', title: '', referrer: '' };
    }
    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    };
  }

  private getScrollDepth(): number {
    if (typeof window === 'undefined') return 0;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  private buildEvent(type: EventType, data: Record<string, unknown> = {}): TrackEvent {
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

  private enqueueEvent(event: TrackEvent): void {
    if (this.state.eventQueue.length >= this.config.maxBatchSize) {
      this.state.eventQueue.shift();
    }
    this.state.eventQueue.push(event);
  }

  private async sendBatch(): Promise<EventsResult> {
    if (this.state.eventQueue.length === 0) return { success: true, accepted: 0, dropped: 0 };

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);
    const sessionId = this.getSessionId();

    const payload = {
      session_id: sessionId,
      events: events.map(e => ({
        type: e.type,
        url: e.url,
        title: e.title,
        referrer: e.referrer,
        data: e.data,
        time_on_page: e.time_on_page,
        scroll_depth: e.scroll_depth,
      })),
    };

    try {
      const response = await fetch(`${this.config.apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
        keepalive: true,
      });
      return await response.json() as EventsResult;
    } catch {
      this.state.eventQueue.unshift(...events);
      return { success: false, accepted: 0, dropped: events.length };
    }
  }

  private scheduleBatch(): void {
    if (this.state.batchTimer) clearTimeout(this.state.batchTimer);
    this.state.batchTimer = setTimeout(() => {
      this.sendBatch();
      this.scheduleBatch();
    }, this.config.batchInterval);
  }

  private log(...args: unknown[]): void {
    if (this.config.debug) console.log('[TrackingService]', ...args);
  }

  async initSession(): Promise<SessionInitResult> {
    const utm = this.getUTMData();
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(utm)) {
      if (val !== null) params.set(key, val);
    }
    const url = `${this.config.apiBase}/session/session.php?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          landing_page: this.getPageData().url,
          referrer: document.referrer,
          user_agent: navigator.userAgent,
        }),
      });
      const data = await response.json() as SessionInitResult;

      if (data.success && data.session_id) {
        this.state.sessionId = data.session_id;
        this.setCookie(this.config.sessionCookieName, data.session_id, this.config.sessionCookieMaxAge);
      }
      return data;
    } catch {
      return { success: true, session_id: this.getSessionId() };
    }
  }

  async sendEvents(): Promise<EventsResult> {
    if (this.state.eventQueue.length === 0) return { success: true, accepted: 0, dropped: 0 };

    const events = this.state.eventQueue.splice(0, this.config.maxBatchSize);

    try {
      const response = await fetch(`${this.config.apiBase}/events.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ session_id: this.getSessionId(), events: events.map(e => ({
          type: e.type,
          url: e.url,
          title: e.title,
          referrer: e.referrer,
          data: e.data,
          time_on_page: e.time_on_page,
          scroll_depth: e.scroll_depth,
        })) }),
        keepalive: true,
      });

      return (await response.json()) as EventsResult;
    } catch (err) {
      this.log('Send events error:', err);
      return { success: false, accepted: 0, dropped: this.config.maxBatchSize };
    }
  }

  trackEvent(type: EventType, data: Record<string, unknown> = {}): void {
    const event = this.buildEvent(type, data);
    this.enqueueEvent(event);
  }

  async initialize(): Promise<void> {
    if (this.state.isInitialized) return;

    if (typeof window === 'undefined') return;

    const doNotTrack = navigator.doNotTrack || (window as Window & { doNotTrack?: string }).doNotTrack;
    if (this.config.respectDNT && doNotTrack === '1') {
      this.log('Do Not Track enabled, tracking disabled');
      return;
    }

    await this.initSession();

    this.scheduleBatch();
    this.setupEventListeners();

    this.state.isInitialized = true;
    this.log('Tracking service initialized');
  }

  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendBatch();
      }
    });

    window.addEventListener('beforeunload', () => {
      this.sendBatch();
    });

    this.trackPageView();

    const originalPushState = history.pushState.bind(history);
    history.pushState = (...args: unknown[]) => {
      originalPushState.apply(history, args as [unknown, string, string]);
      this.handleRouteChange();
    };

    const originalReplaceState = history.replaceState.bind(history);
    history.replaceState = (...args: unknown[]) => {
      originalReplaceState.apply(history, args as [unknown, string, string]);
      this.handleRouteChange();
    };

    window.addEventListener('popstate', () => this.handleRouteChange());
  }

  private handleRouteChange(): void {
    this.state.pageviewSent = false;
    this.state.pageStartTime = Date.now();
    this.state.scrollDepthReached?.clear();
    this.trackPageView();
  }

  trackPageView(data: Record<string, unknown> = {}): void {
    if (this.state.pageviewSent) return;
    this.state.pageviewSent = true;
    this.state.pageStartTime = Date.now();
    this.state.scrollDepthReached?.clear();
    this.state.lastScrollY = window.scrollY || 0;
    this.state.lastScrollTime = Date.now();

    this.trackEvent('pageview', {
      screen_width: screen.width,
      screen_height: screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      ...data,
    });
  }

  trackClick(data: Record<string, unknown>): void {
    this.trackEvent('click', data);
  }

  trackScroll(data: Record<string, unknown>): void {
    this.trackEvent('scroll', data);
  }

  async identify(data: IdentifyData): Promise<IdentifyResult> {
    const sessionId = data.session_id || this.getSessionId();

    try {
      const response = await fetch(`${this.config.apiBase}/identify.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          session_id: sessionId,
          submission_id: data.submission_id || null,
          user_id: data.user_id || null,
          email: data.email,
          phone: data.phone || '',
        }),
      });

      return (await response.json()) as IdentifyResult;
    } catch (err) {
      this.log('Identify error:', err);
      return { success: false, error: 'Identify failed', rows_updated: 0 };
    }
  }

  triggerExitIntent(type: string): void {
    if (this.state.exitIntentTriggered) return;
    this.state.exitIntentTriggered = true;

    this.trackEvent('exit_intent_triggered', { exit_type: type });

    fetch(`${this.config.apiBase}/exit-intent.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ session_id: this.getSessionId(), exit_type: type }),
      keepalive: true,
    }).catch(() => {});
  }

  captureExitIntent(_email: string, _phone: string, exitType: string): Promise<ExitIntentResult> {
    this.trackEvent('exit_intent' as EventType, { exit_type: exitType });
    this.sendBatch();
    return Promise.resolve({ success: true, rows_updated: 0 });
  }

  setConsent(given: boolean): void {
    if (typeof document !== 'undefined') {
      localStorage.setItem('tracking_consent', given ? 'true' : 'false');
      this.setCookie('tracking_consent', given ? 'true' : 'false', this.config.sessionCookieMaxAge);
    }
  }

  getConsent(): boolean {
    if (typeof document === 'undefined') return false;
    const consent = localStorage.getItem('tracking_consent') || this.getCookie('tracking_consent');
    return consent === 'true' || consent === '1';
  }

  getSessionIdOrNull(): string | null {
    return this.state.sessionId;
  }

  isReady(): boolean {
    return this.state.isInitialized;
  }

  isTrackingAllowed(): boolean {
    if (this.config.respectDNT && (navigator.doNotTrack === '1' || (window as Window & { doNotTrack?: string }).doNotTrack === '1')) {
      return false;
    }
    return true;
  }
}

export default TrackingService;
