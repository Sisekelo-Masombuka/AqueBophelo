import React, { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile CAPTCHA Widget Component
 * Dynamically loads Cloudflare's script and renders Turnstile widget.
 * If no siteKey is provided or if window fails to load, gracefully triggers onVerify with dummy token in local dev.
 */
export default function TurnstileWidget({ onVerify, onError, onExpire, className = '' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

  useEffect(() => {
    // If siteKey is missing or invalid placeholder, bypass for local dev testing
    if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
      if (onVerify) onVerify('dev-turnstile-pass');
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null && isMounted) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => {
              if (onVerify && isMounted) onVerify(token);
            },
            'error-callback': () => {
              if (onError && isMounted) onError();
            },
            'expired-callback': () => {
              if (onExpire && isMounted) onExpire();
            },
            theme: 'light',
          });
        } catch (err) {
          console.warn('Turnstile render warning:', err);
        }
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Check if script is already injected
      const existingScript = document.getElementById('cf-turnstile-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'cf-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => renderWidget();
        script.onerror = () => {
          console.warn('Failed to load Cloudflare Turnstile script.');
          if (onVerify) onVerify('dev-turnstile-pass');
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
    }

    return () => {
      isMounted = false;
      if (window.turnstile && widgetIdRef.current !== null) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore cleanup error
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey]);

  if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
    return null; // Don't show anything if unconfigured in local dev
  }

  return (
    <div className={`flex justify-center my-3 min-h-[65px] ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
