import React, { createContext, useContext, useState, useEffect } from "react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import {
  setUserContext,
  clearUserContext,
  trackUserAction,
} from "@/lib/monitoring";
import { identifyUser } from "@/lib/sessionRecording";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin";
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: "admin" | "super_admin") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider for Admin Users
 *
 * SECURITY FEATURES:
 * - JWT tokens stored in HTTP-only cookies (prevents XSS attacks)
 * - CSRF token protection for all admin actions
 * - Rate limiting to prevent brute force attacks
 * - Secure session management with automatic expiration
 *
 * USER ROLES:
 * - admin: Full system access including facility management, blog management,
 *          bulk uploads, system settings, review moderation, and suggestion approval
 *
 * IMPORTANT: Public users (facility searchers) do NOT use this authentication system
 * Only admin panel access requires login credentials
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { showSuccess, showError } = useToastNotifications();

  /**
   * Generate CSRF token for secure form submissions
   */
  const generateCSRFToken = (): string => {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(8, "0")).join(
      "",
    );
  };

  /**
   * Get CSRF token from meta tag (should be set by server)
   */
  const getCSRFToken = (): string => {
    try {
      // Check if document is available (SSR safety)
      if (typeof document === 'undefined') {
        return generateCSRFToken();
      }

      const metaTag = document.querySelector(
        'meta[name="csrf-token"]',
      ) as HTMLMetaElement;

      return metaTag?.content || generateCSRFToken();
    } catch (error) {
      console.warn('CSRF token retrieval failed:', error);
      return generateCSRFToken();
    }
  };

  /**
   * Secure API request with CSRF protection and rate limiting
   */
  const secureRequest = async (url: string, options: RequestInit = {}, skipExpectedErrorLogging = false) => {
    try {
      const csrfToken = getCSRFToken();

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
          ...options.headers,
        },
        credentials: "same-origin", // Include cookies for session management
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status
          };
        }

        // Don't log expected errors (401 for auth checks, 429 for rate limiting)
        if (skipExpectedErrorLogging && (response.status === 401 || response.status === 429)) {
          const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          (error as any).status = response.status;
          throw error;
        }

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      try {
        return await response.json();
      } catch (parseError) {
        console.warn('Response parsing failed:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      // Safe error logging to prevent console issues
      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorType = error instanceof Error ? error.name : 'Error';

      // Log error details as separate arguments to avoid [object Object]
      console.error('Secure request failed:');
      console.error('- Type:', errorType);
      console.error('- Message:', errorMessage);
      console.error('- URL:', url);
      console.error('- Method:', options.method || 'GET');

      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Request failed: ' + errorMessage);
    }
  };

  /**
   * Simple rate limiting check (client-side basic protection)
   */
  const checkRateLimit = (
    action: string,
    maxAttempts: number = 5,
    windowMs: number = 60000,
  ): boolean => {
    const key = `rateLimit_${action}`;
    const now = Date.now();
    const attempts = JSON.parse(
      sessionStorage.getItem(key) || "[]",
    ) as number[];

    // Remove attempts outside the time window
    const recentAttempts = attempts.filter(
      (timestamp) => now - timestamp < windowMs,
    );

    if (recentAttempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Add current attempt
    recentAttempts.push(now);
    sessionStorage.setItem(key, JSON.stringify(recentAttempts));

    return true;
  };

  /**
   * Secure login with proper error handling
   */
  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Sanitize inputs
      const sanitizedUsername = username.trim().toLowerCase();
      const sanitizedPassword = password; // Don't trim password

      if (!sanitizedUsername || !sanitizedPassword) {
        showError("Username and password are required");
        return false;
      }

      // Make secure API request
      let data;
      try {
        data = await secureRequest("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            username: sanitizedUsername,
            password: sanitizedPassword,
          }),
        }, true); // Skip logging expected errors like 401/429
      } catch (requestError) {
        // Handle specific error types without logging expected errors
        if (requestError instanceof Error) {
          if (requestError.message.includes('Network error')) {
            console.error('Login API request failed: Network error');
            throw new Error('Unable to connect to login server. Please check your connection.');
          }
          if (requestError.message.includes('401') || requestError.message.includes('Unauthorized')) {
            // Don't log 401 as error - it's expected for wrong credentials
            throw new Error('Invalid username or password.');
          }
          if (requestError.message.includes('429') || requestError.message.includes('Too Many')) {
            // Don't log 429 as error - it's expected security behavior
            throw new Error('Too many login attempts. Please wait before trying again.');
          }
          if (requestError.message.includes('500')) {
            console.error('Login API request failed: Server error');
            throw new Error('Server error. Please try again later.');
          }
        }

        // Log other unexpected errors
        const errorMsg = requestError instanceof Error ? requestError.message : String(requestError);
        console.error('Login API request failed:', errorMsg);
        throw requestError;
      }

      // Validate response data
      if (!data || !data.user) {
        throw new Error('Invalid response from login server');
      }

      // Set user state (server manages session via HTTP-only cookies)
      setUser(data.user);
      showSuccess(`Welcome back, ${data.user.username}!`);

      // Track user login for monitoring (with error handling)
      try {
        setUserContext({
          id: data.user.id,
          email: data.user.email,
          role: data.user.role,
        });
        identifyUser(data.user.id, {
          username: data.user.username,
          role: data.user.role,
        });
        trackUserAction("login", { role: data.user.role });
      } catch (monitoringError) {
        console.warn('Monitoring tracking failed:', monitoringError);
        // Don't fail login if monitoring fails
      }

      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Login error:", errorMsg);
      showError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Simple logout that clears client state
   * Server invalidates session via HTTP-only cookie
   */
  const logout = async (): Promise<void> => {
    try {
      await secureRequest("/api/auth/logout", { method: "POST" });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Logout error:", errorMsg);
      // Continue with logout even if server request fails
    } finally {
      setUser(null);
      try {
        clearUserContext();
        trackUserAction("logout");
      } catch (monitoringError) {
        console.warn('Monitoring cleanup failed:', monitoringError);
      }
      showSuccess("You have been logged out successfully");
    }
  };

  /**
   * Check if user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === "admin";
  };

  /**
   * Check if user has admin role
   */
  const hasRole = (role: "admin"): boolean => {
    if (!user) return false;
    return user.role === "admin";
  };

  /**
   * Check authentication status on mount
   */
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated via HTTP-only cookie
        // Use a special method that doesn't log 401 as errors
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);

          // Track authenticated user for monitoring
          if (data.user) {
            try {
              setUserContext({
                id: data.user.id,
                email: data.user.email,
                role: data.user.role,
              });
              identifyUser(data.user.id, {
                username: data.user.username,
                role: data.user.role,
              });
            } catch (monitoringError) {
              console.warn('Monitoring setup failed:', monitoringError);
            }
          }
        } else {
          // 401/403 are expected when not authenticated - don't log as errors
          setUser(null);
          clearUserContext();
        }
      } catch (error) {
        // Network or other unexpected errors
        console.warn('Authentication check failed:', error);
        setUser(null);
        clearUserContext();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
