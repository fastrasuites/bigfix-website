/**
 * BigFix Absolute Tracker - Client-side tracking library
 * Version: 1.0.0
 * Lightweight (~3KB gzipped), no dependencies
 * 
 * Features:
 * - Session management (cookie + memory)
 * - Auto pageview tracking (SPA + MPA)
 * - Click tracking (delegated)
 * - Scroll depth tracking (throttled)
 * - Form interaction tracking
 * - Exit intent detection (mouseleave, scroll up, back button, blur)
 * - Batched event sending (5s interval + beforeunload)
 * - Identity linking on form submit
 * - Exit intent popup integration
 * 
 * Usage:
 * <script src="/tracker.js" defer></script>
 * Or: import { initTracker } from './tracker.js'
 */

(function() {
  'use strict';

  // ============================================================
  // Configuration
  // ============================================================
  const CONFIG = {
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

  // ============================================================
  // State
  // ============================================================
  let sessionId = null;
  let eventQueue = [];
  let batchTimer = null;
  let scrollDepthReached = new Set();
  let lastScrollY = 0;
  let lastScrollTime = Date.now();
  let pageStartTime = Date.now();
  let pageviewSent = false;
  let isInitialized = false;
  let consentGiven = false;
  let exitIntentTriggered = false;
  let exitIntentPopupShown = false;

  // ============================================================
  // Utility Functions
  // ============================================================
  function log(...args) {
    if (CONFIG.debug) console.log('[Tracker]', ...args);
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  function setCookie(name, value, maxAge) {
    document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; secure; samesite=lax`;
  }

  function getSessionId() {
    if (sessionId) return sessionId;
    sessionId = getCookie(CONFIG.sessionCookieName);
    if (!sessionId) {
      sessionId = generateUUID();
      setCookie(CONFIG.sessionCookieName, sessionId, CONFIG.sessionCookieMaxAge);
    }
    return sessionId;
  }

  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
    };
  }

  function getPageData() {
    return {
      url: window.location.href,
      title: document.title,
      referrer: document.referrer,
    };
  }

  function getUTMData() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || null,
      utm_medium: params.get('utm_medium') || null,
      utm_campaign: params.get('utm_campaign') || null,
      utm_content: params.get('utm_content') || null,
      utm_term: params.get('utm_term') || null,
    };
  }

  // ============================================================
  // Event Queue & Sending
  // ============================================================
  function enqueueEvent(event) {
    if (eventQueue.length >= CONFIG.maxBatchSize) {
      log('Queue full, dropping oldest event');
      eventQueue.shift();
    }
    eventQueue.push(event);
  }

  function sendBatch() {
    if (eventQueue.length === 0) return;

    const events = eventQueue.splice(0, CONFIG.maxBatchSize);
    const sessionId = getSessionId();

    const payload = {
      session_id: sessionId,
      events: events,
    };

    // Use sendBeacon for reliability on unload, fetch otherwise
    const useBeacon = document.visibilityState === 'hidden';
    const url = `${CONFIG.apiBase}/events.php`;

    if (useBeacon && navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true, // Allow request to complete after unload
      }).catch(err => log('Send error:', err));
    }
  }

  function scheduleBatch() {
    if (batchTimer) clearTimeout(batchTimer);
    batchTimer = setTimeout(() => {
      sendBatch();
      scheduleBatch();
    }, CONFIG.batchInterval);
  }

  // ============================================================
  // Event Builders
  // ============================================================
  function buildEvent(type, data = {}) {
    const pageData = getPageData();
    const utmData = getUTMData();
    return {
      type,
      url: pageData.url,
      title: pageData.title,
      referrer: pageData.referrer,
      data: { ...utmData, ...data },
      time_on_page: Math.round((Date.now() - pageStartTime) / 1000),
      scroll_depth: getScrollDepth(),
    };
  }

  function getScrollDepth() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / docHeight) * 100));
  }

  // ============================================================
  // Event Handlers
  // ============================================================
  function handlePageView() {
    if (pageviewSent) return;
    pageviewSent = true;
    pageStartTime = Date.now();
    scrollDepthReached.clear();
    lastScrollY = window.scrollY || 0;
    lastScrollTime = Date.now();

    enqueueEvent(buildEvent('pageview', {
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    }));
  }

  function handleClick(event) {
    const target = event.target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const selector = getSelector(target);
    const text = (target.innerText || target.textContent || target.value || '').trim().slice(0, 100);

    enqueueEvent(buildEvent('click', {
      element: target.tagName.toLowerCase(),
      selector,
      text,
      href: target.href || null,
      position: { x: rect.left, y: rect.top },
    }));
  }

  function getSelector(el) {
    if (el.id) return `#${el.id}`;
    if (el.className) {
      const classes = el.className.split(' ').filter(c => c && !c.startsWith('w-') && !c.startsWith('h-') && !c.startsWith('text-') && !c.startsWith('bg-') && !c.startsWith('hover:') && !c.startsWith('focus:')).slice(0, 3);
      if (classes.length) return `.${classes.join('.')}`;
    }
    return el.tagName.toLowerCase();
  }

  let scrollTimeout = null;
  function handleScroll() {
    const now = Date.now();
    if (now - lastScrollTime < CONFIG.scrollThrottleMs) return;
    lastScrollTime = now;

    const scrollY = window.scrollY || 0;
    const direction = scrollY > lastScrollY ? 'down' : 'up';
    lastScrollY = scrollY;

    const depth = getScrollDepth();
    CONFIG.scrollDepthThresholds.forEach(threshold => {
      if (depth >= threshold && !scrollDepthReached.has(threshold)) {
        scrollDepthReached.add(threshold);
        enqueueEvent(buildEvent('scroll', { depth: threshold, direction }));
      }
    });

    // Exit intent: scroll up on mobile
    if (direction === 'up' && scrollY > CONFIG.scrollUpThreshold && !exitIntentTriggered) {
      triggerExitIntent('scroll_up');
    }
  }

  function handleFormStart(event) {
    const form = event.target.closest('form');
    if (!form || form.dataset.tracked === 'true') return;
    form.dataset.tracked = 'true';

    enqueueEvent(buildEvent('form_start', {
      form_id: form.id || null,
      form_action: form.action || null,
      form_method: form.method || 'GET',
    }));

    // Track form abandonment
    let interacted = false;
    form.addEventListener('input', () => { interacted = true; }, { once: true });
    form.addEventListener('submit', () => { interacted = true; });
    window.addEventListener('beforeunload', () => {
      if (!interacted) {
        enqueueEvent(buildEvent('form_abandon', { form_id: form.id || null }));
      }
    }, { once: true });
  }

  function handleFormSubmit(event) {
    const form = event.target.closest('form');
    if (!form) return;

    enqueueEvent(buildEvent('form_submit', {
      form_id: form.id || null,
      form_action: form.action || null,
    }));

    // Flush queue immediately
    sendBatch();
  }

  // ============================================================
  // Exit Intent Detection
  // ============================================================
  function triggerExitIntent(type) {
    if (exitIntentTriggered) return;
    exitIntentTriggered = true;

    enqueueEvent(buildEvent('exit_intent', { exit_type: type }));

    // Send exit intent to server
    const sessionId = getSessionId();
    fetch(`${CONFIG.apiBase}/exit-intent.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId, exit_type: type }),
      keepalive: true,
    }).catch(() => {});

    // Show exit intent popup if not already shown
    if (!exitIntentPopupShown && window.ExitIntentPopup) {
      exitIntentPopupShown = true;
      window.ExitIntentPopup.show();
    }
  }

  function handleMouseLeave(event) {
    if (event.clientY <= CONFIG.exitIntentThreshold) {
      triggerExitIntent('mouseleave');
    }
  }

  function handleBlur() {
    if (!exitIntentTriggered && document.visibilityState === 'visible') {
      triggerExitIntent('blur');
    }
  }

  function handlePopState() {
    // SPA navigation - new pageview
    pageviewSent = false;
    handlePageView();
  }

  // ============================================================
  // Identity Linking
  // ============================================================
  function identify(data) {
    const sessionId = getSessionId();
    const payload = {
      session_id: sessionId,
      submission_id: data.submission_id || null,
      user_id: data.user_id || null,
      email: data.email || '',
      phone: data.phone || '',
    };

    return fetch(`${CONFIG.apiBase}/identify.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(r => r.json()).catch(() => {});
  }

  // ============================================================
  // Consent Management
  // ============================================================
  function checkConsent() {
    // Check for GDPR consent cookie or localStorage
    const consent = localStorage.getItem('tracking_consent') || getCookie('tracking_consent');
    return consent === 'true' || consent === '1';
  }

  function setConsent(given) {
    consentGiven = given;
    localStorage.setItem('tracking_consent', given ? 'true' : 'false');
    setCookie('tracking_consent', given ? 'true' : 'false', CONFIG.sessionCookieMaxAge);
  }

  // ============================================================
  // Initialization
  // ============================================================
  function init() {
    if (isInitialized) return;

    // Check DNT header
    if (CONFIG.respectDNT && (navigator.doNotTrack === '1' || window.doNotTrack === '1')) {
      log('Do Not Track enabled, tracking disabled');
      return;
    }

    // Check consent (if you have a consent banner)
    // For now, assume consent given if no explicit rejection
    // In production, integrate with your cookie banner
    consentGiven = checkConsent() !== false;
    if (!consentGiven) {
      log('No consent, tracking disabled');
      return;
    }

    // Initialize session
    getSessionId();

    // Initialize session on server
    const utmParams = new URLSearchParams(getUTMData());
    fetch(`${CONFIG.apiBase}/session/init.php?${utmParams.toString()}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.session_id) {
          sessionId = data.session_id;
          setCookie(CONFIG.sessionCookieName, sessionId, CONFIG.sessionCookieMaxAge);
          log('Session initialized:', sessionId);
        }
      }).catch(() => {});

    // Attach event listeners
    document.addEventListener('click', handleClick, true);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('beforeunload', () => { sendBatch(); });
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('form-start', handleFormStart, true);
    document.addEventListener('submit', handleFormSubmit, true);

    // SPA router integration (React Router, etc.)
    if (window.history && window.history.pushState) {
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(this, arguments);
        handlePopState();
      };
      const originalReplaceState = history.replaceState;
      history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handlePopState();
      };
    }

    // Initial pageview
    handlePageView();

    // Start batch timer
    scheduleBatch();

    isInitialized = true;
    log('Tracker initialized');
  }

  // ============================================================
  // Public API
  // ============================================================
  window.BigFixTracker = {
    init,
    identify,
    trackEvent: (type, data) => enqueueEvent(buildEvent(type, data)),
    trackPageView: handlePageView,
    trackClick: (data) => enqueueEvent(buildEvent('click', data)),
    trackScroll: (data) => enqueueEvent(buildEvent('scroll', data)),
    setConsent,
    getConsent: checkConsent,
    getSessionId,
    isReady: () => isInitialized,
    // Expose for ExitIntentPopup
    triggerExitIntent,
    onExitIntentCaptured: (callback) => {
      window.addEventListener('exitIntentCaptured', callback);
    },
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();