/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous characters and limits length
 */
export function sanitizeInput(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, maxLength);
}

/**
 * Sanitizes HTML content more thoroughly
 * Use for rich text inputs
 */
export function sanitizeHtml(html: string): string {
  if (typeof html !== 'string') {
    return '';
  }

  // List of allowed tags (very restrictive)
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li'];
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove all tags except allowed ones
  sanitized = sanitized.replace(/<(?!\/?(?:p|br|strong|em|u|ul|ol|li)\b)[^>]+>/gi, '');
  
  // Remove event handlers and javascript protocols
  sanitized = sanitized.replace(/on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  return sanitized.trim();
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validates URL format and prevents dangerous protocols
 */
export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Validates and sanitizes phone numbers
 */
export function sanitizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Check if action is rate limited
   * @param key - Unique identifier for the action (e.g., IP address, user ID)
   * @param maxAttempts - Maximum number of attempts allowed
   * @param windowMs - Time window in milliseconds
   */
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
      return true; // Rate limited
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return false;
  }

  /**
   * Clear rate limit for a key
   */
  clearRateLimit(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * CSRF token management
 */
export function generateCSRFToken(): string {
  const array = new Uint32Array(4);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(8, '0')).join('');
}

/**
 * Get CSRF token from meta tag or generate new one
 */
export function getCSRFToken(): string {
  const metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
  return metaTag?.content || generateCSRFToken();
}

/**
 * Secure headers for API requests
 */
export function getSecureHeaders(additionalHeaders: Record<string, string> = {}): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCSRFToken(),
    'X-Requested-With': 'XMLHttpRequest',
    ...additionalHeaders,
  };
}
