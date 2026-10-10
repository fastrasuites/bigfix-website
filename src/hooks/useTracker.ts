import { useEffect, useCallback } from 'react';

/**
 * useTracker - React hook for BigFix Tracker integration
 * Provides type-safe access to tracker methods
 */

interface TrackEventData {
  [key: string]: any;
}

interface IdentifyData {
  submission_id?: number;
  user_id?: number;
  email: string;
  phone?: string;
}

declare global {
  interface Window {
    BigFixTracker: {
      init: () => void;
      identify: (data: IdentifyData) => Promise<any>;
      trackEvent: (type: string, data?: TrackEventData) => void;
      trackPageView: () => void;
      trackClick: (data: TrackEventData) => void;
      trackScroll: (data: TrackEventData) => void;
      setConsent: (given: boolean) => void;
      getConsent: () => boolean;
      getSessionId: () => string | null;
      isReady: () => boolean;
      triggerExitIntent: (type: string) => void;
      onExitIntentCaptured: (callback: (data: any) => void) => void;
    };
  }
}

export function useTracker() {
  const trackEvent = useCallback((type: string, data?: TrackEventData) => {
    window.BigFixTracker?.trackEvent?.(type, data);
  }, []);

  const trackPageView = useCallback(() => {
    window.BigFixTracker?.trackPageView?.();
  }, []);

  const trackClick = useCallback((data: TrackEventData) => {
    window.BigFixTracker?.trackClick?.(data);
  }, []);

  const trackScroll = useCallback((data: TrackEventData) => {
    window.BigFixTracker?.trackScroll?.(data);
  }, []);

  const identify = useCallback(async (data: IdentifyData) => {
    return window.BigFixTracker?.identify?.(data);
  }, []);

  const setConsent = useCallback((given: boolean) => {
    window.BigFixTracker?.setConsent?.(given);
  }, []);

  const getConsent = useCallback(() => {
    return window.BigFixTracker?.getConsent?.() ?? false;
  }, []);

  const getSessionId = useCallback(() => {
    return window.BigFixTracker?.getSessionId?.() ?? null;
  }, []);

  const isReady = useCallback(() => {
    return window.BigFixTracker?.isReady?.() ?? false;
  }, []);

  const triggerExitIntent = useCallback((type: string) => {
    window.BigFixTracker?.triggerExitIntent?.(type);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackScroll,
    identify,
    setConsent,
    getConsent,
    getSessionId,
    isReady,
    triggerExitIntent,
  };
}

/**
 * Hook for form submission with automatic tracking identity linking
 */
export function useFormTracking() {
  const { identify, getSessionId } = useTracker();

  const trackSubmission = useCallback(async (
    submissionData: {
      submission_id: number;
      email: string;
      phone?: string;
      user_id?: number;
    }
  ) => {
    const sessionId = getSessionId();
    if (!sessionId) {
      console.warn('No tracking session available for submission');
      return;
    }

    try {
      await identify({
        submission_id: submissionData.submission_id,
        email: submissionData.email,
        phone: submissionData.phone,
        user_id: submissionData.user_id,
      });
    } catch (err) {
      console.error('Failed to link tracking session to submission:', err);
    }
  }, [identify, getSessionId]);

  return { trackSubmission };
}

/**
 * Hook for manual event tracking with common event types
 */
export function useEventTracking() {
  const { trackEvent } = useTracker();

  const trackPageView = useCallback((pageName: string, data?: Record<string, any>) => {
    trackEvent('pageview', { page_name: pageName, ...data });
  }, [trackEvent]);

  const trackClick = useCallback((element: string, data?: Record<string, any>) => {
    trackEvent('click', { element, ...data });
  }, [trackEvent]);

  const trackFormStart = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_start', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_submit', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, data?: Record<string, any>) => {
    trackEvent('download', { file_name: fileName, ...data });
  }, [trackEvent]);

  const trackCTA = useCallback((ctaName: string, location: string, data?: Record<string, any>) => {
    trackEvent('click', { cta_name: ctaName, location, ...data });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackFormStart,
    trackFormSubmit,
    trackDownload,
    trackCTA,
  };
}

export default useTracker;