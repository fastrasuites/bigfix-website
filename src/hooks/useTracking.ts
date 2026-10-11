/**
 * useTracking hook - React hook for tracking integration
 * 
 * Usage:
 * ```typescript
 * import { useTracking } from '@/hooks/useTracking';
 * 
 * function MyComponent() {
 *   const { trackPageView, trackClick, identify, getSessionId } = useTracking();
 *   // ...
 * }
 * ```
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { tracker } from '@/lib/tracker/Tracker';

/**
 * Main tracking hook - automatically tracks page views on route changes
 * 
 * @returns The tracker singleton instance
 */
export function useTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    if (tracker.isReady()) {
      tracker.trackPageView(location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Initialize tracker on mount if not already
    if (!tracker.isReady()) {
      tracker.init();
    }
  }, []);

  return tracker;
}

export default useTracking;
