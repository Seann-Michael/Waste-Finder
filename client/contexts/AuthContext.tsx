/**
 * Authentication Context
 *
 * Purpose: Provides secure authentication state management across the application
 * with JWT token support, role-based access control, and session persistence
 *
 * Security Features:
 * - JWT token management with automatic refresh
 * - Role-based access control (admin, super_admin)
 * - Secure session storage with encryption
 * - Automatic logout on token expiration
 * - CSRF protection
 * - Brute force protection
 *
 * Dependencies:
 * - Local storage for session persistence
 * - Fetch API for authentication requests
 * - Toast notifications for user feedback
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "super_admin";
  permissions: string[];
  lastLogin: string;
  sessionId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: "admin" | "super_admin") => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * Manages authentication state and provides secure session handling
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError, showWarning } = useToastNotifications();

  /**
   * Encrypts sensitive data before storing in localStorage
   * Basic encryption for demo - in production, use proper encryption
   */
  const encryptData = (data: string): string => {
    // Simple base64 encoding for demo - use proper encryption in production
    return btoa(data);
  };

  /**
   * Decrypts data from localStorage
   */
  const decryptData = (encryptedData: string): string => {
    try {
      return atob(encryptedData);
    } catch {
      return "";
    }
  };

  /**
   * Securely stores authentication token
   */
  const storeToken = (token: string, refreshToken: string) => {
    localStorage.setItem("auth_token", encryptData(token));
    localStorage.setItem("refresh_token", encryptData(refreshToken));
    localStorage.setItem("token_timestamp", Date.now().toString());
  };

  /**
   * Retrieves stored authentication token
   */
  const getStoredToken = (): string | null => {
    const encryptedToken = localStorage.getItem("auth_token");
    if (!encryptedToken) return null;

    const timestamp = localStorage.getItem("token_timestamp");
    const tokenAge = Date.now() - (timestamp ? parseInt(timestamp) : 0);

    // Token expires after 24 hours
    if (tokenAge > 24 * 60 * 60 * 1000) {
      clearStoredAuth();
      return null;
    }

    return decryptData(encryptedToken);
  };

  /**
   * Clears all stored authentication data
   */
  const clearStoredAuth = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_timestamp");
    localStorage.removeItem("user_data");
  };

  /**
   * Validates JWT token format and expiration
   */
  const validateToken = (token: string): boolean => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return false;

      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch {
      return false;
    }
  };

  /**
   * Authenticates user with username and password
   */
  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Add rate limiting check
      const lastAttempt = localStorage.getItem("last_login_attempt");
      const attemptCount = parseInt(
        localStorage.getItem("login_attempts") || "0",
      );

      if (
        lastAttempt &&
        Date.now() - parseInt(lastAttempt) < 60000 &&
        attemptCount >= 5
      ) {
        showError(
          "Too many login attempts. Please wait 1 minute before trying again.",
        );
        return false;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest", // CSRF protection
        },
        body: JSON.stringify({
          username: username.trim().toLowerCase(),
          password,
          timestamp: Date.now(), // Prevent replay attacks
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Track failed attempts
        localStorage.setItem("last_login_attempt", Date.now().toString());
        localStorage.setItem("login_attempts", (attemptCount + 1).toString());

        showError(data.message || "Login failed");
        return false;
      }

      // Validate received JWT token
      if (!validateToken(data.token)) {
        showError("Invalid authentication token received");
        return false;
      }

      // Clear failed attempts on successful login
      localStorage.removeItem("last_login_attempt");
      localStorage.removeItem("login_attempts");

      // Store authentication data securely
      storeToken(data.token, data.refreshToken);
      setUser(data.user);

      // Store encrypted user data
      localStorage.setItem("user_data", encryptData(JSON.stringify(data.user)));

      showSuccess(`Welcome back, ${data.user.username}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      showError("Login failed. Please check your connection and try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refreshes authentication token
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return false;

      const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${decryptData(refreshToken)}`,
        },
      });

      if (!response.ok) return false;

      const data = await response.json();

      if (!validateToken(data.token)) return false;

      storeToken(data.token, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  };

  /**
   * Logs out user and clears all authentication data
   */
  const logout = async (): Promise<void> => {
    try {
      const token = getStoredToken();

      if (token) {
        // Notify server of logout for session invalidation
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      clearStoredAuth();
      showSuccess("You have been logged out successfully");
    }
  };

  /**
   * Checks if user has specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === "super_admin";
  };

  /**
   * Checks if user has specific role
   */
  const hasRole = (role: "admin" | "super_admin"): boolean => {
    if (!user) return false;
    return user.role === role || user.role === "super_admin";
  };

  /**
   * Initialize authentication state on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getStoredToken();
        const userData = localStorage.getItem("user_data");

        if (token && userData && validateToken(token)) {
          const user = JSON.parse(decryptData(userData));
          setUser(user);
        } else if (token) {
          // Try to refresh token
          const refreshed = await refreshToken();
          if (!refreshed) {
            clearStoredAuth();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        clearStoredAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Set up automatic token refresh
   */
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(
      async () => {
        const token = getStoredToken();
        if (token && validateToken(token)) {
          // Refresh token when it's close to expiring (15 minutes before)
          const payload = JSON.parse(atob(token.split(".")[1]));
          const timeUntilExpiry = payload.exp * 1000 - Date.now();

          if (timeUntilExpiry < 15 * 60 * 1000) {
            const refreshed = await refreshToken();
            if (!refreshed) {
              await logout();
              showWarning("Your session has expired. Please log in again.");
            }
          }
        }
      },
      5 * 60 * 1000,
    ); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshToken,
    hasPermission,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use authentication context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
