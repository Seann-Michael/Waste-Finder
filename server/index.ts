/**
 * Express Server Configuration
 *
 * Purpose: Main server setup with comprehensive API routes and security
 *
 * Security Features:
 * - CORS configuration
 * - Request body size limits
 * - Error handling
 * - Basic authentication
 */

import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleLocationsSearch,
  handleLocationById,
  handleAllLocations,
} from "./routes/locations";
import { handleLogin, handleLogout, handleAuthMe } from "./routes/auth";
import {
  parseRSSFeed,
  testRSSFeed,
  getRSSFeeds,
  createRSSFeed,
  updateRSSFeed,
  deleteRSSFeed,
  getAggregatedNews
} from "./routes/rss";
import {
  authRateLimit,
  apiRateLimit,
  publicRateLimit,
} from "./middleware/rateLimiter";

export function createServer() {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  // Demo endpoint with public rate limiting
  app.get("/api/demo", publicRateLimit, handleDemo);

  // Authentication routes with strict rate limiting
  app.post("/api/auth/login", authRateLimit, handleLogin);
  app.post("/api/auth/logout", apiRateLimit, handleLogout);
  app.get("/api/auth/me", apiRateLimit, handleAuthMe);

  // Public location routes with public rate limiting
  app.get("/api/locations/all", publicRateLimit, handleAllLocations);
  app.get("/api/locations", publicRateLimit, handleLocationsSearch);
  app.get("/api/locations/:id", publicRateLimit, handleLocationById);

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
