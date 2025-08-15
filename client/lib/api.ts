import { getSecureHeaders } from "./security";
import { trackApiCall } from "./monitoring";

/**
 * API Client for WasteFinder Application
 *
 * PURPOSE: Centralized HTTP client with enterprise-grade error handling and monitoring
 *
 * FEATURES:
 * - Automatic retry with exponential backoff for failed requests
 * - Request/response caching with configurable TTL
 * - Comprehensive error handling with custom error types
 * - Request timeout management and abort signal support
 * - Performance monitoring and API response time tracking
 * - Security headers and CSRF protection for admin requests
 *
 * ERROR HANDLING STRATEGY:
 * - Network errors: Automatic retry with backoff
 * - 4xx errors: No retry (client errors)
 * - 5xx errors: Retry with exponential backoff
 * - Timeout errors: Configurable timeout with retry
 *
 * MONITORING INTEGRATION:
 * - Basic error logging for debugging
 * - Performance metrics for API response times
 * - Custom events for business logic tracking
 *
 * DEVELOPER NOTES:
 * - All API calls should use this client for consistency
 * - Response caching improves performance for frequently accessed data
 * - Error boundaries will catch and display API errors to users
 */

/**
 * Custom error classes for better error handling and user feedback
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class NetworkError extends Error {
  constructor(message: string = "Network request failed") {
    super(message);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string = "Request timed out") {
    super(message);
    this.name = "TimeoutError";
  }
}

/**
 * Retry configuration
 */
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Calculate exponential backoff delay
 */
const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt - 1);
  return Math.min(delay, config.maxDelay);
};

/**
 * Check if error is retryable
 */
const isRetryableError = (error: any): boolean => {
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof APIError) {
    // Retry on server errors (5xx) but not client errors (4xx)
    return error.status >= 500;
  }
  return false;
};

/**
 * Centralized API client with error handling, retries, and caching
 */
export class APIClient {
  private baseURL: string;
  private defaultTimeout: number;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;

  constructor(baseURL = "/api", defaultTimeout = 10000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
    this.cache = new Map();
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;

    return Date.now() - cached.timestamp < cached.ttl;
  }

  /**
   * Get data from cache
   */
  private getCachedData<T>(cacheKey: string): T | null {
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    // Remove expired cache
    this.cache.delete(cacheKey);
    return null;
  }

  /**
   * Store data in cache
   */
  private setCachedData<T>(cacheKey: string, data: T, ttl: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Make HTTP request with retry logic
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG,
    timeout: number = this.defaultTimeout,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    let lastError: Error;
    const startTime = performance.now();

    for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            ...getSecureHeaders(),
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const duration = performance.now() - startTime;

        // Track API call performance
        trackApiCall(endpoint, 'GET', duration, response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new APIError(
            response.status,
            errorData.message ||
              `HTTP ${response.status}: ${response.statusText}`,
            errorData,
          );
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        clearTimeout(timeoutId);
        const duration = performance.now() - startTime;

        if (error.name === "AbortError") {
          lastError = new TimeoutError(`Request timed out after ${timeout}ms`);
        } else if (
          error instanceof TypeError &&
          error.message.includes("fetch")
        ) {
          lastError = new NetworkError("Network request failed");
        } else {
          lastError = error;
        }

        // Track failed API calls
        const statusCode = lastError instanceof APIError ? lastError.status : 0;
        trackApiCall(endpoint, 'GET', duration, statusCode);

        // Don't retry on the last attempt or if error is not retryable
        if (
          attempt === retryConfig.maxAttempts ||
          !isRetryableError(lastError)
        ) {
          throw lastError;
        }

        // Wait before retrying
        const delay = calculateDelay(attempt, retryConfig);
        await sleep(delay);
      }
    }

    throw lastError!;
  }

  /**
   * GET request with caching
   */
  async get<T>(
    endpoint: string,
    options: {
      cache?: boolean;
      cacheTTL?: number;
      timeout?: number;
      retryConfig?: Partial<RetryConfig>;
    } = {},
  ): Promise<T> {
    const {
      cache = true,
      cacheTTL = 5 * 60 * 1000, // 5 minutes default
      timeout = this.defaultTimeout,
      retryConfig = {},
    } = options;

    // Check cache first
    if (cache) {
      const cacheKey = `GET:${endpoint}`;
      const cachedData = this.getCachedData<T>(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    }

    const finalRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
    const data = await this.makeRequest<T>(
      endpoint,
      { method: "GET" },
      finalRetryConfig,
      timeout,
    );

    // Cache successful GET requests
    if (cache) {
      const cacheKey = `GET:${endpoint}`;
      this.setCachedData(cacheKey, data, cacheTTL);
    }

    return data;
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data: any,
    options: {
      timeout?: number;
      retryConfig?: Partial<RetryConfig>;
    } = {},
  ): Promise<T> {
    const { timeout = this.defaultTimeout, retryConfig = {} } = options;

    const finalRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

    return this.makeRequest<T>(
      endpoint,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      finalRetryConfig,
      timeout,
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data: any,
    options: {
      timeout?: number;
      retryConfig?: Partial<RetryConfig>;
    } = {},
  ): Promise<T> {
    const { timeout = this.defaultTimeout, retryConfig = {} } = options;

    const finalRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

    return this.makeRequest<T>(
      endpoint,
      {
        method: "PUT",
        body: JSON.stringify(data),
      },
      finalRetryConfig,
      timeout,
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: {
      timeout?: number;
      retryConfig?: Partial<RetryConfig>;
    } = {},
  ): Promise<T> {
    const { timeout = this.defaultTimeout, retryConfig = {} } = options;

    const finalRetryConfig = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };

    return this.makeRequest<T>(
      endpoint,
      { method: "DELETE" },
      finalRetryConfig,
      timeout,
    );
  }

  /**
   * Clear cache
   */
  clearCache(pattern?: string): void {
    if (pattern) {
      for (const [key] of this.cache) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create singleton API client instance
export const apiClient = new APIClient();

// Convenience methods
export const api = {
  // Location endpoints
  locations: {
    getAll: (params?: any) =>
      apiClient.get("/locations/all", {
        cache: true,
        cacheTTL: 5 * 60 * 1000, // 5 minutes
      }),
    getById: (id: string) =>
      apiClient.get(`/locations/${id}`, {
        cache: true,
        cacheTTL: 10 * 60 * 1000, // 10 minutes
      }),
    search: (params: any) =>
      apiClient.get("/locations", {
        cache: true,
        cacheTTL: 2 * 60 * 1000, // 2 minutes for search results
      }),
    create: (data: any) => apiClient.post("/locations", data),
    update: (id: string, data: any) => apiClient.put(`/locations/${id}`, data),
    delete: (id: string) => apiClient.delete(`/locations/${id}`),
  },

  // Auth endpoints
  auth: {
    login: (credentials: any) =>
      apiClient.post("/auth/login", credentials, {
        retryConfig: { maxAttempts: 1 }, // Don't retry auth failures
      }),
    logout: () => apiClient.post("/auth/logout", {}),
    me: () => apiClient.get("/auth/me", { cache: false }),
  },

  // Blog endpoints
  blog: {
    getPosts: () =>
      apiClient.get("/blog/posts", {
        cache: true,
        cacheTTL: 10 * 60 * 1000, // 10 minutes
      }),
    getPost: (slug: string) =>
      apiClient.get(`/blog/posts/${slug}`, {
        cache: true,
        cacheTTL: 30 * 60 * 1000, // 30 minutes
      }),
  },
};
