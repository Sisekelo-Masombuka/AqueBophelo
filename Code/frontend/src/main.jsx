import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

if (sentryDsn && sentryDsn !== 'your-sentry-dsn-here') {
  Sentry.init({
    dsn: sentryDsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    ignoreErrors: [
      /Object Not Found Matching Id/i,
      /MethodName:update/i,
      /ResizeObserver loop/i,
      /chrome-extension:\/\//i,
      /moz-extension:\/\//i,
      /safari-extension:\/\//i,
    ],
    beforeSend(event, hint) {
      const errorMsg =
        event?.message ||
        event?.exception?.values?.[0]?.value ||
        (typeof hint?.originalException === 'string' ? hint.originalException : '');

      if (
        /Object Not Found Matching Id/i.test(errorMsg) ||
        /MethodName:update/i.test(errorMsg) ||
        /chrome-extension/i.test(errorMsg) ||
        /moz-extension/i.test(errorMsg) ||
        /safari-extension/i.test(errorMsg)
      ) {
        return null; // Drop bot crawler & browser extension noise
      }

      if (event.request && event.request.headers) {
        delete event.request.headers['Authorization'];
      }
      return event;
    },
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <LanguageProvider>
            <App />
          </LanguageProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
