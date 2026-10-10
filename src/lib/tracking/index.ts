/**
 * BigFix Tracking Library - Main Exports
 * 
 * Usage:
 * import { TrackingProvider, useTracking, useFormTracking, useEventTracking } from '@/lib/tracking';
 * 
 * // Wrap your app
 * <TrackingProvider>
 *   <App />
 * </TrackingProvider>
 * 
 * // In components
 * const { trackEvent, identify, trackSubmission } = useTracking();
 * 
 * // In forms
 * const { trackSubmission } = useFormTracking();
 */

// Types
export * from './types';

// Core service
export { TrackingService } from './TrackingService';
export { default as trackingService } from './TrackingService';

// React Context & Provider
export { TrackingProvider, useTracking } from './TrackingContext';

// Hooks
export { 
  useFormTracking, 
  useEventTracking 
} from './hooks';

// Export types for consumers
export type {
  EventType,
  TrackEventData,
  TrackEvent,
  UTMData,
  PageData,
  SessionData,
  IdentifyData,
  ExitIntentData,
  EnrichmentData,
  GeoData,
  TrackingConfig,
  TrackingState,
  TrackerConfig,
  TrackerMethods,
  TrackerContextValue,
  SessionInitResult,
  EventsResult,
  IdentifyResult,
  ExitIntentResult,
  CleanupResult,
  EnrichmentResult,
} from './types';