/**
 * Tracking Context - React Context for tracking
 * Provides tracking methods to all components
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react';
import TrackingService from './TrackingService';
import type {
  TrackEventData,
  IdentifyData,
} from './types';

interface TrackingContextValue {
  trackEvent: (type: string, data?: Record<string, any>) => void;
  trackPageView: (data?: Record<string, any>) => void;
  trackClick: (data: Record<string, any>) => void;
  trackScroll: (data: Record<string, any>) => void;
  trackFormStart: (formName: string, data?: Record<string, any>) => void;
  trackFormSubmit: (formName: string, data?: Record<string, any>) => void;
  trackDownload: (fileName: string, data?: Record<string, any>) => void;
  trackCTA: (ctaName: string, location: string, data?: Record<string, any>) => void;
  identify: (data: { submission_id?: number; user_id?: number; email: string; phone?: string }) => Promise<any>;
  setConsent: (given: boolean) => void;
  getConsent: () => boolean;
  getSessionId: () => string | null;
  isReady: () => boolean;
  triggerExitIntent: (type: string) => void;
  onExitIntentCaptured: (callback: (data: any) => void) => void;
}

export const TrackingContext = createContext<TrackingContextValue | null>(null);

/**
 * TrackingProvider - Wrap your app with this to enable tracking
 */
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
  autoInit = true 
}: TrackingProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const serviceRef = useRef<TrackingService | null>(null);
  const exitIntentCallbacksRef = useRef<((data: any) => void)[]>([]);

  // Initialize tracking service
  useEffect(() => {
    const service = TrackingService.getInstance();
    serviceRef.current = service;
    
    // Configure
    if (Object.keys(config).length > 0) {
      service.configure(config);
    }

    if (autoInit) {
      service.initialize().then(() => {
        setIsReady(true);
      });
    }

    // Cleanup on unmount
    return () => {
      // Cleanup if needed
    };
  }, [config, autoInit]);

  const value: TrackingContextValue = {
    trackEvent: useCallback((type: string, data?: Record<string, any>) => {
      TrackingService.getInstance().trackEvent(type, data);
    }, []),

    trackPageView: useCallback((data?: Record<string, any>) => {
      TrackingService.getInstance().trackPageView(data);
    }, []),

    trackClick: useCallback((data: Record<string, any>) => {
      TrackingService.getInstance().trackClick(data);
    }, []),

    trackScroll: useCallback((data: Record<string, any>) => {
      TrackingService.getInstance().trackScroll(data);
    }, []),

    trackFormStart: useCallback((formName: string, data?: Record<string, any>) => {
      TrackingService.getInstance().trackEvent('form_start', { form_name: formName, ...data });
    }, []),

    trackFormSubmit: useCallback((formName: string, data?: Record<string, any>) => {
      TrackingService.getInstance().trackEvent('form_submit', { form_name: formName, ...data });
    }, []),

    trackDownload: useCallback((fileName: string, data?: Record<string, any>) => {
      TrackingService.getInstance().trackEvent('download', { file_name: fileName, ...data });
    }, []),

    trackCTA: useCallback((ctaName: string, location: string, data?: Record<string, any>) => {
      TrackingService.getInstance().trackEvent('click', { cta_name: ctaName, location, ...data });
    }, []),

    identify: useCallback(async (data: { submission_id?: number; user_id?: number; email: string; phone?: string }) => {
      return TrackingService.getInstance().identify(data);
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

    onExitIntentCaptured: useCallback((callback: (data: any) => void) => {
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

/**
 * TrackingProvider - Wrap your app with this to enable tracking
 */
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