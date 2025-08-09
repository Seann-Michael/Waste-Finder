/**
 * Basic monitoring utilities without external dependencies
 * Sentry has been removed to simplify builds and reduce dependencies
 */

/**
 * Simple event tracking for development/debugging
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>,
) {
  if (import.meta.env.DEV) {
    console.log(`Event: ${eventName}`, properties);
  }
}

/**
 * Simple error logging without external services
 */
export function logError(error: Error, context?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.error("Error:", error.message, context);
  }
}

/**
 * Track user actions for debugging
 */
export function trackUserAction(action: string, details?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.log(`User Action: ${action}`, details);
  }
}

/**
 * Simple API call tracking
 */
export function trackApiCall(
  endpoint: string,
  method: string,
  duration: number,
  status: number,
) {
  if (import.meta.env.DEV) {
    console.log(`API Call: ${method} ${endpoint} - ${status} (${duration}ms)`);
  }
}

/**
 * Set user context (simplified)
 */
export function setUserContext(user: { id: string; email?: string }) {
  if (import.meta.env.DEV) {
    console.log("User context set:", user.id);
  }
}

/**
 * Clear user context
 */
export function clearUserContext() {
  if (import.meta.env.DEV) {
    console.log("User context cleared");
  }
}

// Backward compatibility - empty function
export function initSentry() {
  // Sentry removed - this is now a no-op function
}
