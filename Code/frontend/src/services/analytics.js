/**
 * POPIA-Compliant Google Analytics Integration Service
 * Dynamically loads gtag.js ONLY after explicit user consent is granted.
 */

let isGAInitialized = false;

export function initGoogleAnalytics() {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (!measurementId || measurementId === 'G-YOUR_MEASUREMENT_ID_HERE') {
    console.warn('Google Analytics Measurement ID is not configured in local environment.');
    return;
  }

  if (isGAInitialized || typeof window === 'undefined') return;

  try {
    // 1. Inject gtag.js script dynamically
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // 2. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', measurementId, {
      anonymize_ip: true, // POPIA / Privacy anonymization
      send_page_view: true,
    });

    isGAInitialized = true;
    console.log('Google Analytics (gtag.js) successfully initialized with POPIA IP anonymization.');
  } catch (err) {
    console.error('Failed to initialize Google Analytics:', err);
  }
}

export function logPageView(path) {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (isGAInitialized && window.gtag && measurementId) {
    window.gtag('config', measurementId, {
      page_path: path,
    });
  }
}
