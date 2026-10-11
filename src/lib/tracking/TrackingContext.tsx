/**
 * Tracking Context - React Context for tracking
 * Provides tracking methods to all components
 */

import { createContext, useContext, useEffect, useRef, useCallback, ReactNode } from 'react';
import TrackingService from './TrackingService';
import type { EventType } from './types';

interface TrackingContextValue {
  trackEvent: (type: string, data?: Record<string, unknown>) => void;
  trackPageView: (data?: Record<string, unknown>) => void;
  trackClick: (data: Record<string, unknown>) => void;
  trackScroll: (data: Record<string, unknown>) => void;
  trackFormStart: (formName: string, data?: Record<string, unknown>) => void;
  trackFormSubmit: (formName: string, data?: Record<string, unknown>) => void;
  trackDownload: (fileName: string, data?: Record<string, unknown>) => void;
  trackCTA: (ctaName: string, location: string, data?: Record<string, unknown>) => void;
  identify: (data: { submission_id?: number; user_id?: number; email: string; phone?: string }) => Promise<Record<string, unknown>>;
  setConsent: (given: boolean) => void;
  getConsent: () => boolean;
  getSessionId: () => string | null;
  isReady: () => boolean;
  triggerExitIntent: (type: string) => void;
  onExitIntentCaptured: (callback: (data: Record<string, unknown>) => void) => () => void;
}

export const TrackingContext = createContext<TrackingContextValue | null>(null);

interface TrackingProviderProps {
  children: ReactNode;
  config?: Partial<{
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
  }>;
  autoInit?: boolean;
}

export function TrackingProvider({
  children,
  config = {},
  autoInit = true,
}: TrackingProviderProps) {
  const serviceRef = useRef<TrackingService | null>(null);
  const exitIntentCallbacksRef = useRef<((data: Record<string, unknown>) => void)[]>([]);

  useEffect(() => {
    const service = TrackingService.getInstance();
    serviceRef.current = service;

    if (Object.keys(config).length > 0) {
      service.configure(config);
    }

    if (autoInit) {
      service.initialize();
    }

    return () => {
      // Cleanup if needed
    };
  }, [config, autoInit]);

  const value: TrackingContextValue = {
    trackEvent: useCallback((type: string, data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackEvent(type as EventType, data);
    }, []),

    trackPageView: useCallback((data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackPageView(data);
    }, []),

    trackClick: useCallback((data: Record<string, unknown>) => {
      TrackingService.getInstance().trackClick(data);
    }, []),

    trackScroll: useCallback((data: Record<string, unknown>) => {
      TrackingService.getInstance().trackScroll(data);
    }, []),

    trackFormStart: useCallback((formName: string, data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackEvent('form_start', { form_name: formName, ...data });
    }, []),

    trackFormSubmit: useCallback((formName: string, data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackEvent('form_submit', { form_name: formName, ...data });
    }, []),

    trackDownload: useCallback((fileName: string, data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackEvent('download', { file_name: fileName, ...data });
    }, []),

    trackCTA: useCallback((ctaName: string, location: string, data?: Record<string, unknown>) => {
      TrackingService.getInstance().trackEvent('click', { cta_name: ctaName, location, ...data });
    }, []),

    identify: useCallback(async (data: { submission_id?: number; user_id?: number; email: string; phone?: string }) => {
      const sessionId = TrackingService.getInstance().getSessionId();
      const result = await TrackingService.getInstance().identify({
        session_id: sessionId ?? '',
        ...data,
      });
      return result as unknown as Record<string, unknown>;
    }, []),

    setConsent: useCallback((given: boolean) => {
      TrackingService.getInstance().setConsent(given);
    }, []),

    getConsent: useCallback(() => {
      return TrackingService.getInstance().getConsent();
    }, []),

    getSessionId: useCallback(() => {
      return TrackingService.getInstance().getSessionId();
    }, []),

    isReady: useCallback(() => {
      return TrackingService.getInstance().isReady();
    }, []),

    triggerExitIntent: useCallback((type: string) => {
      TrackingService.getInstance().triggerExitIntent(type);
    }, []),

    onExitIntentCaptured: useCallback((callback: (data: Record<string, unknown>) => void) => {
      exitIntentCallbacksRef.current.push(callback);
      return () => {
        const index = exitIntentCallbacksRef.current.indexOf(callback);
        if (index > -1) exitIntentCallbacksRef.current.splice(index, 1);
      };
    }, []),
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
}

export const useTracking = (): TrackingContextValue => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

export const useTrackingContext = (): TrackingContextValue => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTrackingContext must be used within a TrackingProvider');
  }
  return context;
};
