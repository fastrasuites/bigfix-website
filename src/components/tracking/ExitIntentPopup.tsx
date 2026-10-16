/**
 * ExitIntentPopup - Shows a popup when user tries to leave, after a delay, or when scrolling down on key pages
 * 
 * Triggers:
 * - Mouse move to top of viewport (desktop)
 * - 45s timer after page load
 * - 70% scroll depth on form pages (/book-demo, /contact)
 * - Back button via popstate
 * 
 * Cooldown: localStorage bf_popup_last_shown (24h)
 * 
 * On submit:
 * - Calls tracker.identify()
 * - POSTs to /api/tracking/identify.php
 * - Sets localStorage bf_identified
 * - Triggers exit_intent_converted event
 * - Shows success toast
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { tracker } from '@/lib/tracker/Tracker';

// Nigerian phone number validation
// Accepts: +234XXXXXXXXX, +254XXXXXXXXX, 0XXXXXXXXX (local format)
const PHONE_REGEX_NG = /^(\+234|0)[789]\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Cooldown period (24 hours in milliseconds)
const POPUP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface ExitIntentPopupProps {
  /** Pages where scroll-based popup trigger is active (pages with forms) */
  triggerPages?: string[];
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  triggerPages = ['/book-demo', '/contact', '/pricing'],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const popupRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mouseLeaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if popup was recently shown (cooldown)
  const checkCooldown = useCallback((): boolean => {
    if (typeof localStorage === 'undefined') return true;
    const lastShown = localStorage.getItem('bf_popup_last_shown');
    if (lastShown) {
      const elapsed = Date.now() - parseInt(lastShown, 10);
      if (elapsed < POPUP_COOLDOWN_MS) {
        return false; // Still in cooldown
      }
    }
    return true;
  }, []);

  // Check if user has already been identified
  const isIdentified = useCallback((): boolean => {
    if (typeof localStorage === 'undefined') return false;
    return (
      localStorage.getItem('bf_identified') === 'true' ||
      tracker.isIdentified()
    );
  }, []);

  // Track pricing page views
  const [currentPath, setCurrentPath] = useState('');
  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Mouse leave detection (desktop exit intent)
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isOpen || !checkCooldown() || isIdentified()) return;

    // Mouse moved to top of viewport (< 0 pixels from top)
    if (e.clientY <= 0) {
      // Debounce to avoid accidental triggers
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current);
      }
      mouseLeaveTimerRef.current = setTimeout(() => {
        if (checkCooldown() && !isIdentified()) {
          // Track exit intent trigger
          tracker.trackEvent('exit_intent_triggered', {
            exit_type: 'mouseleave',
            page: window.location.pathname,
          });
          setIsOpen(true);
          // Record cooldown timestamp
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('bf_popup_last_shown', Date.now().toString());
          }
        }
      }, 300);
    }
  }, [isOpen, checkCooldown, isIdentified]);

  // Back button detection (popstate)
  const handlePopState = useCallback(() => {
    if (isOpen || !checkCooldown() || isIdentified()) return;

    const shouldTrigger = triggerPages.some(page =>
      currentPath.includes(page)
    );
    if (shouldTrigger) {
      setIsOpen(true);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bf_popup_last_shown', Date.now().toString());
      }
    }
  }, [isOpen, checkCooldown, isIdentified, currentPath, triggerPages]);

  // Scroll detection on form pages (70% depth)
  const handleScroll = useCallback(() => {
    if (isOpen || !checkCooldown() || isIdentified()) return;

    const shouldCheckScroll = triggerPages.some(page =>
      currentPath.includes(page)
    );

    if (shouldCheckScroll) {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollPercent = (scrollY / (docHeight - viewportHeight)) * 100;

      if (scrollPercent >= 70) {
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
        // Show popup after slight delay at 70% scroll
        inactivityTimerRef.current = setTimeout(() => {
          if (checkCooldown() && !isIdentified()) {
            tracker.trackEvent('exit_intent_triggered', {
              exit_type: 'scroll_depth',
              page: window.location.pathname,
            });
            setIsOpen(true);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('bf_popup_last_shown', Date.now().toString());
            }
          }
        }, 500);
      }
    }
  }, [isOpen, checkCooldown, isIdentified, currentPath, triggerPages]);

  // Time-based trigger (30 seconds on any page)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        !isOpen &&
        checkCooldown() &&
        !isIdentified()
      ) {
        tracker.trackEvent('exit_intent_triggered', {
          exit_type: 'timer',
          page: window.location.pathname,
        });
        setIsOpen(true);
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('bf_popup_last_shown', Date.now().toString());
        }
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isOpen, checkCooldown, isIdentified]);

   // Setup global event listeners
  useEffect(() => {
    if (!isOpen) {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Window/tab close attempt detection
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isOpen || !checkCooldown() || isIdentified()) return;

      // Track the exit intent trigger
      tracker.trackEvent('exit_intent_triggered', {
        exit_type: 'beforeunload',
        page: window.location.pathname,
      });

      // Set cooldown timestamp
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bf_popup_last_shown', Date.now().toString());
      }

      // Note: Modern browsers require returnValue to show a native confirm dialog
      // We cannot show our custom popup here due to browser security restrictions,
      // but we track the attempt
      e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (mouseLeaveTimerRef.current) clearTimeout(mouseLeaveTimerRef.current);
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    };
  }, [handleMouseMove, handlePopState, handleScroll, isOpen, checkCooldown, isIdentified]);

  // Focus email input when popup opens
  useEffect(() => {
    if (isOpen && emailRef.current) {
      setTimeout(() => emailRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Form validation
  const validateForm = (): string | null => {
    if (!EMAIL_REGEX.test(email)) {
      return 'Please enter a valid email address';
    }
    if (phone && !PHONE_REGEX_NG.test(phone)) {
      return 'Please enter a valid Nigerian phone number (+234 or 0 followed by 10 digits)';
    }
    return null;
  };

  // Format phone to international if local format
  const formatPhone = (p: string): string => {
    if (p.startsWith('0') && p.length === 11) {
      return '+234' + p.substring(1);
    }
    return p;
  };

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const formattedPhone = phone ? formatPhone(phone) : undefined;

    try {
      // Call tracker.identify
      await tracker.identify(email, formattedPhone, 'exit_intent');

      // Set identified flag in localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('bf_identified', 'true');
      }

      // Trigger conversion event
      tracker.trackEvent('exit_intent_converted', {
        email: email,
        phone: formattedPhone || '',
        source: 'exit_intent_popup',
      });

      // Flush events immediately
      await tracker.flush();

      setShowSuccess(true);
      setIsOpen(false);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [email, phone]);

  // If already identified, don't show popup
  if (isIdentified()) {
    return showSuccess ? (
      <div className="fixed bottom-4 right-4 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg">
        <svg className="inline-block w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
         Thank you! We&apos;ll be in touch soon.
      </div>
    ) : null;
  }

  return (
    <>
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 z-50 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Thank you! We&apos;ll reach out shortly.</span>
        </div>
      )}

      {/* Exit Intent Popup Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-intent-title"
        >
          <div
            ref={popupRef}
            className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close popup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Popup content */}
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.5 15l2.5-2.5M12 17l2.5-2.5 2.5 2.5M12 13l2.5-2.5M12 13l2.5-2.5" />
                </svg>
              </div>

              <h2 id="exit-intent-title" className="text-xl font-bold text-gray-800 mb-2">
                Wait! Don&apos;t go yet
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                 Enter your email and we&apos;ll send you <strong className="text-blue-600">exclusive pricing</strong> and a <strong className="text-blue-600">free consultation</strong>.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your work email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    autoComplete="email"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 XXX XXX XXXX (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
                    autoComplete="tel"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Get Exclusive Pricing'
                  )}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExitIntentPopup;
