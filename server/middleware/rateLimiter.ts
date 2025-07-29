import { Request, Response, NextFunction } from "express";

interface RateLimitData {
  requests: number[];
  blocked: boolean;
  blockUntil?: number;
}

/**
 * Simple in-memory rate limiter
 * In production, use Redis or a dedicated rate limiting service
 */
class RateLimiter {
  private clients: Map<string, RateLimitData> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up old entries every 10 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      10 * 60 * 1000,
    );
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  private cleanup() {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    for (const [key, data] of this.clients.entries()) {
      // Remove old requests
      data.requests = data.requests.filter(
        (timestamp) => timestamp > fiveMinutesAgo,
      );

      // Remove blocked clients whose block has expired
      if (data.blocked && data.blockUntil && now > data.blockUntil) {
        data.blocked = false;
        data.blockUntil = undefined;
      }

      // Remove entries with no recent activity
      if (data.requests.length === 0 && !data.blocked) {
        this.clients.delete(key);
      }
    }
  }

  /**
   * Check if client is rate limited
   */
  isRateLimited(
    clientId: string,
    maxRequests: number = 100,
    windowMs: number = 60 * 1000, // 1 minute
    blockDurationMs: number = 5 * 60 * 1000, // 5 minutes
  ): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    let clientData = this.clients.get(clientId);
    if (!clientData) {
      clientData = { requests: [], blocked: false };
      this.clients.set(clientId, clientData);
    }

    // Check if client is currently blocked
    if (
      clientData.blocked &&
      clientData.blockUntil &&
      now < clientData.blockUntil
    ) {
      return true;
    }

    // Remove requests outside the time window
    clientData.requests = clientData.requests.filter(
      (timestamp) => timestamp > windowStart,
    );

    // Check if rate limit is exceeded
    if (clientData.requests.length >= maxRequests) {
      // Block the client
      clientData.blocked = true;
      clientData.blockUntil = now + blockDurationMs;
      return true;
    }

    // Add current request
    clientData.requests.push(now);
    return false;
  }

  /**
   * Get remaining requests for a client
   */
  getRemainingRequests(
    clientId: string,
    maxRequests: number = 100,
    windowMs: number = 60 * 1000,
  ): number {
    const now = Date.now();
    const windowStart = now - windowMs;

    const clientData = this.clients.get(clientId);
    if (!clientData) {
      return maxRequests;
    }

    const recentRequests = clientData.requests.filter(
      (timestamp) => timestamp > windowStart,
    );
    return Math.max(0, maxRequests - recentRequests.length);
  }

  /**
   * Clear rate limit for a client (useful for testing or admin override)
   */
  clearRateLimit(clientId: string): void {
    this.clients.delete(clientId);
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clients.clear();
  }
}

// Create global rate limiter instance
const rateLimiter = new RateLimiter();

/**
 * Express middleware for rate limiting
 */
export function createRateLimitMiddleware(
  options: {
    maxRequests?: number;
    windowMs?: number;
    blockDurationMs?: number;
    keyGenerator?: (req: Request) => string;
    message?: string;
    statusCode?: number;
  } = {},
) {
  const {
    maxRequests = 100,
    windowMs = 60 * 1000, // 1 minute
    blockDurationMs = 5 * 60 * 1000, // 5 minutes
    keyGenerator = (req) => req.ip || "unknown",
    message = "Too many requests. Please try again later.",
    statusCode = 429,
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = keyGenerator(req);

    if (
      rateLimiter.isRateLimited(
        clientId,
        maxRequests,
        windowMs,
        blockDurationMs,
      )
    ) {
      res.status(statusCode).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(blockDurationMs / 1000), // seconds
      });
      return;
    }

    // Add rate limit headers
    const remaining = rateLimiter.getRemainingRequests(
      clientId,
      maxRequests,
      windowMs,
    );
    res.set({
      "X-RateLimit-Limit": maxRequests.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": new Date(Date.now() + windowMs).toISOString(),
    });

    next();
  };
}

/**
 * Strict rate limiter for authentication endpoints
 */
export const authRateLimit = createRateLimitMiddleware({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 30 * 60 * 1000, // 30 minutes
  message: "Too many authentication attempts. Please try again in 30 minutes.",
});

/**
 * Standard rate limiter for API endpoints
 */
export const apiRateLimit = createRateLimitMiddleware({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 5 * 60 * 1000, // 5 minutes
});

/**
 * Lenient rate limiter for public endpoints
 */
export const publicRateLimit = createRateLimitMiddleware({
  maxRequests: 200,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 2 * 60 * 1000, // 2 minutes
});

export default rateLimiter;
