import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

import type { HonoBindings } from "~/workers/types";

import auth from "~/workers/api/features/auth";
import landingPageRoute from "~/workers/api/features/landing-page";
import {
  corsMiddleware,
  logger,
  prettyJSON,
  requestId,
  securityHeaders,
} from "~/workers/middleware/common";
import {
  errorHandler,
  onError,
  rateLimit,
  requestLogger,
} from "~/workers/middleware/error";
import { HTTP_STATUS } from "~/workers/types";

const app = new Hono<HonoBindings>();

/**
 * Middleware Stack Application
 * Applied in order of execution priority for optimal performance and security
 */

// 1. Request tracing - First to ensure all requests get unique IDs
app.use("*", requestId);

// 2. Security middleware - Applied early for protection
app.use("*", corsMiddleware); // Uses VITE_PROD_DOMAIN for production
app.use("*", securityHeaders);

// 3. Rate limiting - In production only (placeholder for future KV implementation)
if (!import.meta.env.DEV) {
  // Use environment variables for rate limiting, with defaults
  const RATE_LIMIT_REQUESTS =
    Number(import.meta.env.RATE_LIMIT_REQUESTS) || 100;
  const RATE_LIMIT_WINDOW = Number(import.meta.env.RATE_LIMIT_WINDOW) || 60000;
  app.use("*", rateLimit(RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW)); // Configurable via env
}

// 4. Logging middleware - After security, before processing
app.use("*", requestLogger); // Enhanced structured logging

// 5. Development-only middleware - Conditional application
if (import.meta.env.DEV) {
  app.use("*", logger()); // Hono's built-in logger for development only
}

// 6. Response formatting - Applied to all environments
app.use("*", prettyJSON());

// 7. Error handling - Must be last in middleware chain
app.use("*", errorHandler);

// Global error handler for uncaught exceptions
app.onError(onError);

/**
 * API Routes Definition
 * All routes are automatically prefixed with /api when mounted in main app
 */

// API Root - Provides basic API information
app.get("/", (c) => {
  const requestId = c.res.headers.get("X-Request-ID");
  return c.json({
    success: true,
    data: {
      message: "NARA Boilerplate API",
      version: "1.0.0",
      environment: import.meta.env.MODE,
      timestamp: new Date().toISOString(),
      requestId,
    },
  });
});

// Simple hello world endpoint for testing
app.get("/hello-world", (c) => {
  const requestId = c.res.headers.get("X-Request-ID");
  return c.json({
    success: true,
    data: {
      message: "Hello, World!",
      requestId,
    },
  });
});

// Enhanced health check endpoint with detailed system information
app.get("/health", (c) => {
  const requestId = c.res.headers.get("X-Request-ID");
  const uptime = Date.now(); // In a real scenario, this would be actual uptime

  return c.json({
    success: true,
    data: {
      status: "healthy",
      timestamp: new Date().toISOString(),
      environment: import.meta.env.MODE,
      version: "1.0.0",
      uptime,
      requestId,
      checks: {
        api: "operational",
        database: "operational", // Could add actual DB health check here
        middleware: "operational",
      },
    },
  });
});

/**
 * Feature Routes
 * Organized by functionality for better maintainability
 */
app.route("/landing-page", landingPageRoute);
app.route("/auth", auth);

/**
 * Development & Testing Routes
 * Only available in development mode
 */
if (import.meta.env.DEV) {
  // Test error handling middleware
  app.get("/error", (c) => {
    const requestId = c.res.headers.get("X-Request-ID");
    throw new HTTPException(HTTP_STATUS.BAD_REQUEST, {
      message: JSON.stringify({
        success: false,
        error: "This is a test error for middleware validation",
        requestId,
      }),
    });
  });

  // Test different error types
  app.get("/error/:type", (c) => {
    const type = c.req.param("type");
    const requestId = c.res.headers.get("X-Request-ID");

    switch (type) {
      case "500":
        throw new Error("Internal server error simulation");
      case "404":
        throw new HTTPException(HTTP_STATUS.NOT_FOUND, {
          message: JSON.stringify({
            success: false,
            error: "Resource not found",
            requestId,
          }),
        });
      case "validation":
        throw new HTTPException(HTTP_STATUS.UNPROCESSABLE_ENTITY, {
          message: JSON.stringify({
            success: false,
            error: "Validation failed",
            requestId,
            details: { field: "example", message: "Required field missing" },
          }),
        });
      default:
        return c.json({
          success: true,
          data: {
            message: "Available error types: 500, 404, validation",
            requestId,
          },
        });
    }
  });
}

/**
 * Fallback handler for unmatched routes
 * Provides consistent 404 response format
 */
app.all("*", (c) => {
  const requestId = c.res.headers.get("X-Request-ID");
  return c.json(
    {
      success: false,
      error: "API endpoint not found",
      path: c.req.path,
      method: c.req.method,
      requestId,
    },
    HTTP_STATUS.NOT_FOUND,
  );
});

export default app;
