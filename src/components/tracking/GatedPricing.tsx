/**
 * GatedPricing - Wrapper that gates pricing content behind email capture
 * 
 * If user is identified OR has viewed pricing fewer than 3 times:
 * - Show pricing normally
 * 
 * If user is NOT identified AND has viewed pricing >= 3 times:
 * - Show blurred pricing with a CTA overlay
 * - CTA: "Enter work email to unlock pricing"
 * 
 * Uses tracker singleton for tracking views and identification
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { tracker } from '@/lib/tracker/Tracker';

const PRICING_VIEW_THRESHOLD = 3;
const STORAGE_KEY_VIEWS = 'bf_pricing_views';
const STORAGE_KEY_IDENTIFIED = 'bf_identified';

interface GatedPricingProps {
  children: React.ReactNode;
  className?: string;
}

export const GatedPricing: React.FC<GatedPricingProps> = ({
  children,
  className = '',
}) => {
  const [isIdentified, setIsIdentified] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check identification status
  const checkIdentified = useCallback((): boolean => {
    if (typeof localStorage === 'undefined') return false;
    return (
      localStorage.getItem(STORAGE_KEY_IDENTIFIED) === 'true' ||
      tracker.isIdentified()
    );
  }, []);

  // Get view count from localStorage
  const getViewCount = useCallback((): number => {
    if (typeof localStorage === 'undefined') return 0;
    const stored = localStorage.getItem(STORAGE_KEY_VIEWS);
    return stored ? parseInt(stored, 10) : 0;
  }, []);

  // Save view count to localStorage
  const saveViewCount = useCallback((count: number): void => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_VIEWS, count.toString());
    }
  }, []);

  // Increment view count on mount
  useEffect(() => {
    const identified = checkIdentified();
    const views = getViewCount() + 1;
    
    setViewCount(views);
    saveViewCount(views);
    setIsIdentified(identified);
    
    // Track on backend
    tracker.trackCustom('view_pricing', {
      view_count: views,
      already_identified: identified ? '1' : '0',
    });
  }, [checkIdentified, getViewCount, saveViewCount]);

  // Check if pricing should be gated
  const shouldGate = !isIdentified && viewCount >= PRICING_VIEW_THRESHOLD && !isUnlocked;
  const shouldShowCTO = !isIdentified && viewCount >= PRICING_VIEW_THRESHOLD - 1 && !isUnlocked;

  // Handle unlock form submission
  const handleUnlock = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Identify via tracker
      await tracker.identify(email, undefined, 'gated_view');

      // Set identified flag
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_IDENTIFIED, 'true');
      }

      // Track unlock event
      tracker.trackEvent('gated_view' as never, { unlocked: true });
      tracker.trackEvent('exit_intent_converted' as never, { email, source: 'gated_pricing' });
      
      await tracker.flush();

      setIsUnlocked(true);
      setIsIdentified(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  // If already unlocked or identified, show pricing normally
  if (isUnlocked || isIdentified) {
    return (
      <div ref={containerRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}

      {/* Blur overlay when gating */}
      {shouldGate && (
        <>
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-xl z-10"
            aria-hidden="true"
          />
          
          {/* CTA overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Unlock Pricing
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter your work email to see full pricing details
              </p>

              <form onSubmit={handleUnlock} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoComplete="email"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {isSubmitting ? 'Unlocking...' : 'Show Pricing'}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-3">
                No spam, ever.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Subtle CTA hint for near-threshold viewers */}
      {shouldShowCTO && !shouldGate && (
        <div className="absolute -top-2 -right-2 z-10 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
          Enter email to unlock
        </div>
      )}
    </div>
  );
};

export default GatedPricing;
