import { Request, Response } from "express";

/**
 * Demo authentication routes
 * In production, these would integrate with a proper authentication system
 */

// Mock user database
const mockUsers = [
  {
    id: "admin-1",
    username: "admin",
    email: "admin@wastefinder.com",
    password: "wastefinderadmin2024", // In production, this would be hashed
    role: "admin" as const,
    permissions: [
      "locations.read",
      "locations.write",
      "suggestions.read",
      "suggestions.write",
    ],
  },
  {
    id: "super-admin-1",
    username: "superadmin",
    email: "superadmin@wastefinder.com",
    password: "superadminpassword2024", // In production, this would be hashed
    role: "super_admin" as const,
    permissions: ["*"], // All permissions
  },
];

/**
 * Validate CSRF token
 */
function validateCSRFToken(req: Request): boolean {
  const token = req.headers["x-csrf-token"] as string;
  const expectedToken = "demo-csrf-token-12345"; // In production, this would be dynamic and secure

  return token === expectedToken;
}

/**
 * POST /api/auth/login
 * Demo login endpoint
 */
export async function handleLogin(req: Request, res: Response) {
  try {
    // Validate CSRF token
    if (!validateCSRFToken(req)) {
      return res.status(403).json({
        success: false,
        error: "Invalid CSRF token",
        message: "Security validation failed",
      });
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Missing credentials",
        message: "Username and password are required",
      });
    }

    // Find user
    const user = mockUsers.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password,
    );

    if (!user) {
      // Simulate a delay to prevent timing attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      });
    }

    // In production, set secure HTTP-only session cookie here
    // For demo, we'll just return user data
    const userResponse = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
    };

    res.json({
      success: true,
      user: userResponse,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "An unexpected error occurred",
    });
  }
}

/**
 * POST /api/auth/logout
 * Demo logout endpoint
 */
export function handleLogout(req: Request, res: Response) {
  try {
    // In production, invalidate session cookie here
    res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * GET /api/auth/me
 * Check current authentication status
 */
export function handleAuthMe(req: Request, res: Response) {
  try {
    // In production, validate session cookie here
    // For demo, always return not authenticated
    res.status(401).json({
      success: false,
      error: "Not authenticated",
      message: "No valid session found",
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

/**
 * POST /api/auth/refresh
 * Refresh authentication token (for future use)
 */
export function handleRefreshToken(req: Request, res: Response) {
  try {
    res.status(501).json({
      success: false,
      error: "Not implemented",
      message: "Token refresh not implemented in demo",
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
