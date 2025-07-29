import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export function initSentry() {
  // Only initialize in production or when SENTRY_DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_ENVIRONMENT || 'development';

  if (!dsn && environment === 'production') {
    console.warn('Sentry DSN not configured. Error tracking disabled.');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration({
        // Set sampling rates
        tracePropagationTargets: ["localhost", /^\//],
      }),
    ],

    // Performance monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,

    // Session replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,

    // Error filtering
    beforeSend(event, hint) {
      // Filter out known development errors
      const error = hint.originalException;

      // Ignore React dev warnings
      if (error && error.toString().includes('Warning:')) {
        return null;
      }

      // Ignore network errors from localhost
      if (error && error.toString().includes('localhost')) {
        return null;
      }

      return event;
    },

    // Additional configuration
    debug: environment === 'development',
    release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  });
}

/**
 * Log custom events for business metrics
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message: eventName,
    level: 'info',
    data,
  });
}

/**
 * Track user interactions
 */
export function trackUserAction(action: string, details?: Record<string, any>) {
  Sentry.setTag('user_action', action);
  Sentry.addBreadcrumb({
    message: `User action: ${action}`,
    level: 'info',
    data: details,
  });
}

/**
 * Track API response times
 */
export function trackAPICall(endpoint: string, duration: number, status: number) {
  Sentry.addBreadcrumb({
    message: `API call: ${endpoint}`,
    level: status >= 400 ? 'error' : 'info',
    data: {
      endpoint,
      duration_ms: duration,
      status,
    },
  });
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: { id: string; email?: string; role?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

/**
 * Clear user context on logout
 */
export function clearUserContext() {
  Sentry.setUser(null);
}
