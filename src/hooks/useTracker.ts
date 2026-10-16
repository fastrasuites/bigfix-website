import { useCallback } from 'react';
import { tracker } from '@/lib/tracker/Tracker';

interface TrackEventData {
  [key: string]: unknown;
}

interface IdentifyData {
  submission_id?: number;
  user_id?: number;
  email: string;
  phone?: string;
}

export function useTracker() {
  const trackEvent = useCallback((type: string, data?: TrackEventData) => {
    tracker.trackEvent(type as never, data as Record<string, unknown>);
  }, []);

  const trackPageView = useCallback(() => {
    tracker.trackPageView();
  }, []);

  const trackClick = useCallback((data: TrackEventData) => {
    tracker.trackClick(data as Record<string, unknown>);
  }, []);

  const trackScroll = useCallback((data: TrackEventData) => {
    tracker.trackScroll(data as Record<string, unknown>);
  }, []);

  const identify = useCallback(async (data: IdentifyData) => {
    const result = await tracker.identify(
      data.email,
      data.phone,
      'form_submit'
    );
    return result as unknown as Record<string, unknown>;
  }, []);

  const setConsent = useCallback((given: boolean) => {
    if (!given) {
      tracker.optOut();
    }
  }, []);

  const getConsent = useCallback(() => {
    return !tracker.isOptedOut();
  }, []);

  const getSessionId = useCallback(() => {
    return tracker.getSessionId();
  }, []);

  const isReady = useCallback(() => {
    return tracker.isReady();
  }, []);

  const triggerExitIntent = useCallback((type: string) => {
    tracker.triggerExitIntent(type as never);
  }, []);

  const onExitIntentCaptured = useCallback(() => {
    // No-op: exit intent capture is handled via the tracker singleton
    return () => {};
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
    onExitIntentCaptured,
  };
}

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

export function useEventTracking() {
  const { trackEvent } = useTracker();

  const trackPageView = useCallback((pageName: string, data?: Record<string, unknown>) => {
    trackEvent('pageview', { page_name: pageName, ...data });
  }, [trackEvent]);

  const trackClick = useCallback((element: string, data?: Record<string, unknown>) => {
    trackEvent('click', { element, ...data });
  }, [trackEvent]);

  const trackFormStart = useCallback((formName: string, data?: Record<string, unknown>) => {
    trackEvent('form_start', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, data?: Record<string, unknown>) => {
    trackEvent('form_submit', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, data?: Record<string, unknown>) => {
    trackEvent('download', { file_name: fileName, ...data });
  }, [trackEvent]);

  const trackCTA = useCallback((ctaName: string, location: string, data?: Record<string, unknown>) => {
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
