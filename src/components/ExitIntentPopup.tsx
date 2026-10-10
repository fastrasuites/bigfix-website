import React, { useState, useEffect, useRef } from 'react';

/**
 * ExitIntentPopup - Captures email/phone before user leaves pricing page
 * Triggers on: mouseleave (desktop), scroll up (mobile), back button, tab blur
 * 
 * Usage:
 * <ExitIntentPopup
 *   triggerPages={['/pricing', '/pricing/*']}
 *   onCapture={(email, phone) => console.log('Captured:', email, phone)}
 *   offer="Get pricing PDF + free consultation"
 * />
 */

interface ExitIntentPopupProps {
  triggerPages?: string[];           // Pages where popup can trigger
  offer?: string;                    // Value proposition text
  onCapture?: (email: string, phone: string) => void;
  delayMs?: number;                  // Delay before showing (default: 30000 = 30s)
  cooldownDays?: number;             // Don't show again for N days (default: 30)
  className?: string;
}

const STORAGE_KEY = 'exit_intent_dismissed';
const CAPTURED_KEY = 'exit_intent_captured';

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({
  triggerPages = ['/pricing'],
  offer = 'Get our pricing guide + free 15-min consultation — no spam, just value.',
  onCapture,
  delayMs = 30000,
  cooldownDays = 30,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitIntentTriggered = useRef(false);

  // Check if we should show popup
  const shouldShow = useRef(false);

  // Check if current page matches trigger pages
  const isTriggerPage = triggerPages.some(pattern => {
    if (pattern.endsWith('*')) {
      return window.location.pathname.startsWith(pattern.slice(0, -1));
    }
    return window.location.pathname === pattern;
  });

  // Check cooldown
  const checkCooldown = () => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) return false;
    
    const dismissedAt = parseInt(dismissed, 10);
    const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
    return Date.now() - dismissedAt < cooldownMs;
  };

  // Check if already captured
  const checkCaptured = () => {
    return localStorage.getItem(CAPTURED_KEY) === 'true';
  };

  // Initialize exit intent detection
  useEffect(() => {
    if (!isTriggerPage()) return;
    if (checkCooldown()) return;
    if (checkCaptured()) return;
    if (exitIntentTriggered.current) return;

    // Delay before enabling exit intent
    timeoutRef.current = setTimeout(() => {
      shouldShow.current = true;
      attachExitIntentListeners();
    }, delayMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      removeExitIntentListeners();
    };
  }, [isTriggerPage, delayMs, cooldownDays]);

  const attachExitIntentListeners = () => {
    if (exitIntentTriggered.current) return;

    // Desktop: mouseleave near top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 20 && !exitIntentTriggered.current) {
        triggerExitIntent('mouseleave');
      }
    };

    // Mobile: scroll up aggressively
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY - 100 && window.scrollY > 100) {
        triggerExitIntent('scroll_up');
      }
      lastScrollY = currentY;
    };

    // Tab blur / window focus loss
    const handleBlur = () => {
      if (!exitIntentTriggered.current) {
        triggerExitIntent('blur');
      }
    };

    // Back button / popstate
    const handlePopState = () => {
      triggerExitIntent('back_button');
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('blur', handleBlur);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('popstate', handlePopState);
    };
  };

  const removeExitIntentListeners = () => {
    // Listeners removed in cleanup
  };

  const triggerExitIntent = (type: string) => {
    if (exitIntentTriggered.current) return;
    exitIntentTriggered.current = true;
    setIsVisible(true);
    document.body.style.overflow = 'hidden';

    // Notify server
    if (window.BigFixTracker) {
      window.BigFixTracker.triggerExitIntent(type);
    }

    // Track event
    if (window.BigFixTracker) {
      window.BigFixTracker.trackEvent('exit_intent', { exit_type: type });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setSubmitting(false);
      return;
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      setSubmitting(false);
      return;
    }

    try {
      const sessionId = window.BigFixTracker?.getSessionId?.() || 
        document.cookie.match(/tracking_sid=([^;]+)/)?.[1] || 
        crypto.randomUUID();

      const response = await fetch('/api/tracking/exit-intent.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          email,
          phone,
          exit_type: exitIntentTriggered.current ? 'popup_submit' : 'unknown',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        localStorage.setItem(CAPTURED_KEY, 'true');
        onCapture?.(email, phone);

        // Notify parent tracker
        if (window.BigFixTracker) {
          window.BigFixTracker.trackEvent('exit_intent_submit', { email, phone });
        }

        // Auto-close after 2 seconds
        setTimeout(() => closePopup(), 2000);
      } else {
        setError(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const closePopup = () => {
    setIsVisible(false);
    document.body.style.overflow = '';
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    exitIntentTriggered.current = true;
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePopup();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closePopup();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

      {/* Popup */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {success ? (
          // Success state
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You're all set!</h3>
            <p className="text-gray-600">We'll send the pricing guide to <strong>{email}</strong> shortly.</p>
            {phone && <p className="text-gray-600 mt-1">Our team will call <strong>{phone}</strong> within 24 hours.</p>}
          </div>
        ) : (
          // Form state
          <>
            <div className="text-center mb-6">
              <h2 id="exit-intent-title" className="text-2xl font-bold text-gray-900 mb-2">
                Before you go...
              </h2>
              <p className="text-gray-600">{offer}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  placeholder="+234 8XX XXX XXXX"
                  autoComplete="tel"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Get My Pricing Guide'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                We respect your privacy. No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ExitIntentPopup;