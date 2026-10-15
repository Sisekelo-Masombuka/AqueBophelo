import React, { useEffect, useRef } from 'react';

/**
 * Cloudflare Turnstile CAPTCHA Widget Component
 * Dynamically loads Cloudflare's script and renders Turnstile widget.
 * If no siteKey is provided or if window fails to load, gracefully triggers onVerify with dummy token in local dev.
 */
export default function TurnstileWidget({ onVerify, onError, onExpire, className = '' }) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  const onVerifyRef = useRef(onVerify);
  const onErrorRef = useRef(onError);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onErrorRef.current = onError;
    onExpireRef.current = onExpire;
  }, [onVerify, onError, onExpire]);

  const siteKey = 
    (typeof window !== 'undefined' && window.__CONFIG__?.VITE_TURNSTILE_SITE_KEY) ||
    import.meta.env.VITE_TURNSTILE_SITE_KEY || 
    '1x00000000000000000000AA';
  const isDev = Boolean(import.meta.env.DEV);

  useEffect(() => {
    // If siteKey is missing or invalid placeholder, only bypass in local development
    if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
      if (isDev) {
        onVerifyRef.current?.('dev-turnstile-pass');
      } else {
        onErrorRef.current?.('Security challenge is unconfigured in production.');
      }
      return;
    }

    let isMounted = true;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && widgetIdRef.current === null && isMounted) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token) => {
              if (isMounted) onVerifyRef.current?.(token);
            },
            'error-callback': () => {
              if (isMounted) onErrorRef.current?.('Security challenge failed verification.');
            },
            'expired-callback': () => {
              if (isMounted) onExpireRef.current?.();
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
          console.error('Failed to load Cloudflare Turnstile script.');
          if (isDev) {
            onVerifyRef.current?.('dev-turnstile-pass');
          } else {
            onErrorRef.current?.('Failed to load security challenge. Please verify your connection.');
          }
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
        } catch {
          // ignore cleanup error
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, isDev]);

  if (!siteKey || siteKey === 'your-turnstile-site-key-here') {
    if (isDev) {
      return null; // Don't show anything if unconfigured in local dev
    }
    return (
      <div className="p-3 my-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded text-center">
        Security verification (Turnstile) is not configured. Form submissions are disabled in production.
      </div>
    );
  }

  return (
    <div className={`flex justify-center my-3 min-h-[65px] ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
