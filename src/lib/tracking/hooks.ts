/**
 * useTracker - Main hook for tracking in React components
 * Provides type-safe access to all tracking methods
 */

import { useContext, useCallback } from 'react';
import { TrackingContext } from './TrackingContext';
import type {
  TrackEventData,
  IdentifyData,
  TrackEventData,
  IdentifyData,
} from './types';

/**
 * Main tracking hook - use this in components to track events
 */
export function useTracker() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracker must be used within a TrackingProvider');
  }
  return context;
}

/**
 * Hook for form submission with automatic tracking identity linking
 */
export function useFormTracking() {
  const { identify, getSessionId } = useContext(TrackingContext);

  const trackSubmission = useCallback(async (
    submissionData: {
      submission_id: number;
      email: string;
      phone?: string;
      user_id?: number;
    }
  ) => {
    const sessionId = context.getSessionId();
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
  }, [context.identify, context.getSessionId]);

  return { trackSubmission };
}

/**
 * Hook for common event tracking patterns
 */
export function useEventTracking() {
  const { trackEvent } = useContext(TrackingContext);

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

  const trackScroll = useCallback((depth: number, direction: 'up' | 'down', data?: Record<string, any>) => {
    trackEvent('scroll', { depth, direction, ...data });
  }, [trackEvent]);

  const trackFormStart = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_start', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackFormSubmit = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_submit', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackFormAbandon = useCallback((formName: string, data?: Record<string, any>) => {
    trackEvent('form_abandon', { form_name: formName, ...data });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, data?: Record<string, any>) => {
    trackEvent('download', { file_name: fileName, ...data });
  }, [trackEvent]);

  const trackCTA = useCallback((ctaName: string, location: string, data?: Record<string, any>) => {
    trackEvent('click', { cta_name: ctaName, location, ...data });
  }, [trackEvent]);

  const trackScroll = useCallback((depth: number, direction: 'up' | 'down', data?: Record<string, any>) => {
    trackEvent('scroll', { depth, direction, ...data });
  }, [trackEvent]);

  const trackExitIntent = useCallback((exitType: string, data?: Record<string, any>) => {
    trackEvent('exit_intent', { exit_type: exitType, ...data });
  }, [trackEvent]);

  const trackExitIntentSubmit = useCallback((email: string, phone: string, data?: Record<string, any>) => {
    trackEvent('exit_intent_submit', { email, phone, ...data });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackFormStart,
    trackFormSubmit,
    trackFormAbandon,
    trackDownload,
    trackCTA,
    trackScroll,
    trackExitIntent,
    trackExitIntentSubmit,
  };
}

/**
 * Hook for form submission with automatic tracking identity linking
 */
export function useFormTracking() {
  const { identify, getSessionId } = useContext(TrackingContext);

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

export { useTracker as default };