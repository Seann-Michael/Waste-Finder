/**
 * Express Server Configuration
 *
 * Purpose: Main server setup with comprehensive API routes,
 * security middleware, and authentication
 *
 * Security Features:
 * - CORS configuration
 * - Rate limiting
 * - Request body size limits
 * - Security headers
 * - Error handling
 */

import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { handleDemo } from "./routes/demo";
import {
  handleLocationsSearch,
  handleLocationById,
  handleAllLocations,
  handleCreateLocation,
  handleUpdateLocation,
  handleDeleteLocation,
  handleToggleLocationStatus,
} from "./routes/locations";
import {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleVerifyToken,
  authenticateToken,
  requirePermission,
  loginRateLimit,
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for development
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS configuration
  app.use(
    cors({
      origin:
        process.env.NODE_ENV === "production"
          ? ["https://yourdomain.com"] // Replace with your domain
          : ["http://localhost:3000", "http://localhost:5173"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
  );

  // Body parsing middleware with size limits
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // General rate limiting
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // API rate limiting (more restrictive)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window for API calls
    message: {
      error: "Too many API requests, please try again later.",
    },
  });

  // Apply rate limiting
  app.use("/api", apiLimiter);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    });
  });

  // Basic ping endpoint
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Waste Finder API Server is running!" });
  });

  // Demo endpoint
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", loginRateLimit, handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.post("/api/auth/refresh", handleRefreshToken);
  app.get("/api/auth/verify", handleVerifyToken);

  // Public location routes (read-only)
  app.get("/api/locations/all", handleAllLocations);
  app.get("/api/locations/search", handleLocationsSearch);
  app.get("/api/locations/:id", handleLocationById);

  // Protected location routes (require authentication)
  app.post(
    "/api/locations",
    authenticateToken,
    requirePermission("locations.write"),
    handleCreateLocation,
  );

  app.put(
    "/api/locations/:id",
    authenticateToken,
    requirePermission("locations.write"),
    handleUpdateLocation,
  );

  app.delete(
    "/api/locations/:id",
    authenticateToken,
    requirePermission("locations.delete"),
    handleDeleteLocation,
  );

  app.patch(
    "/api/locations/:id/status",
    authenticateToken,
    requirePermission("locations.write"),
    handleToggleLocationStatus,
  );

  // 404 handler for API routes
  app.use("/api/*", (_req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
      message: "The requested API endpoint does not exist.",
    });
  });

  // Global error handler
  app.use(
    (
      err: any,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("Server error:", err);

      // Don't leak error details in production
      const isDevelopment = process.env.NODE_ENV === "development";

      res.status(err.status || 500).json({
        success: false,
        error: isDevelopment ? err.message : "Internal server error",
        ...(isDevelopment && { stack: err.stack }),
      });
    },
  );

  return app;
}
