import React, { createContext, useContext, useState, useEffect } from "react";
import { useToastNotifications } from "@/hooks/use-toast-notifications";

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToastNotifications();

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const sessionToken = localStorage.getItem('admin-session');
        if (!sessionToken) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            "X-Session-Token": sessionToken,
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
          }
        } else {
          // Invalid session, remove token
          localStorage.removeItem('admin-session');
        }
      } catch (error) {
        console.warn('Session check failed:', error);
        localStorage.removeItem('admin-session');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": "demo-csrf-token-12345", // Demo token
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        setUser(data.user);
        
        // Store session token if provided
        if (data.sessionToken) {
          localStorage.setItem('admin-session', data.sessionToken);
        }

        showSuccess(`Welcome back, ${data.user.username}!`);
        return true;
      } else {
        const errorMessage = data.message || data.error || 'Login failed';
        if (response.status === 429) {
          showError("Too many login attempts. Please wait before trying again.");
        } else if (response.status === 401) {
          showError("Invalid username or password");
        } else {
          showError(errorMessage);
        }
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Login failed. Please check your connection and try again.");
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const sessionToken = localStorage.getItem('admin-session');
      
      if (sessionToken) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "X-Session-Token": sessionToken,
            "X-Requested-With": "XMLHttpRequest",
          },
        });
      }
    } catch (error) {
      console.warn("Logout request failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('admin-session');
      showSuccess("You have been logged out successfully");
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission) || user.role === "admin";
  };

  const hasRole = (role: "admin" | "super_admin"): boolean => {
    if (!user) return false;
    return user.role === "admin";
  };

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

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
