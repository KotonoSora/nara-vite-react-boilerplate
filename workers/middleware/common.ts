import type { HonoBindings } from "~/workers/types";
import type { MiddlewareHandler } from "hono";

import { HTTP_STATUS } from "~/workers/types";

/**
 * Enhanced security headers middleware
 * Adds comprehensive security headers following OWASP recommendations
 * Applied only to API routes as per requirement to limit middleware to /api paths
 */
export const securityHeaders: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  await next();

  // Basic security headers
  c.res.headers.set("X-Content-Type-Options", "nosniff");
  c.res.headers.set("X-Frame-Options", "DENY");
  c.res.headers.set("X-XSS-Protection", "1; mode=block");
  c.res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // API-specific CSP (more permissive for API endpoints)
  const csp = [
    "default-src 'none'", // Start with nothing for API endpoints
    "connect-src 'self'", // Allow API connections
  ].join("; ");

  c.res.headers.set("Content-Security-Policy", csp);

  // HSTS for HTTPS environments (production with VITE_PROD_DOMAIN)
  const prodDomain = import.meta.env.VITE_PROD_DOMAIN;
  if (prodDomain && c.req.url.startsWith("https://")) {
    c.res.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  // Permissions Policy for API endpoints (deny unnecessary permissions)
  c.res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  );

  // Additional API-specific security headers
  c.res.headers.set("X-Robots-Tag", "noindex, nofollow"); // Prevent API indexing
  c.res.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
};

/**
 * CORS middleware with environment-specific configuration
 * Uses VITE_PROD_DOMAIN for production domain configuration as per requirements
 */
export const corsMiddleware: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  const isDev = import.meta.env.DEV;
  const prodDomain = import.meta.env.VITE_PROD_DOMAIN;

  // Set origin based on environment and VITE_PROD_DOMAIN
  const origin = isDev
    ? "*" // Allow all origins in development
    : prodDomain
      ? `https://${prodDomain}` // Use configured production domain
      : "https://localhost:3000"; // Fallback for production without domain

  // Set CORS headers with proper configuration
  c.res.headers.set("Access-Control-Allow-Origin", origin);
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  c.res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept",
  );
  c.res.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  // Enable credentials for authenticated requests
  if (origin !== "*") {
    c.res.headers.set("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    return new Response("", { status: HTTP_STATUS.NO_CONTENT });
  }

  await next();
};

/**
 * Request ID middleware for tracing
 * Generates unique request ID for each API call to improve debugging and monitoring
 */
export const requestId: MiddlewareHandler<HonoBindings> = async (c, next) => {
  // Check if request already has an ID from client
  const existingId = c.req.header("X-Request-ID");
  const requestId = existingId || crypto.randomUUID();

  // Set response header for client reference
  c.res.headers.set("X-Request-ID", requestId);

  await next();
};

/**
 * Request size limitation middleware
 * Prevents large payloads from consuming excessive memory
 */
export const requestSizeLimit = (
  maxSizeBytes: number = 1024 * 1024,
): MiddlewareHandler<HonoBindings> => {
  return async (c, next) => {
    const contentLength = c.req.header("Content-Length");

    if (contentLength && parseInt(contentLength) > maxSizeBytes) {
      const requestId = c.res.headers.get("X-Request-ID");

      return c.json(
        {
          success: false,
          error: "Request payload too large",
          ...(requestId && { requestId }),
          ...(import.meta.env.DEV && {
            details: {
              maxSize: `${maxSizeBytes} bytes`,
              received: `${contentLength} bytes`,
            },
          }),
        },
        HTTP_STATUS.PAYLOAD_TOO_LARGE,
      );
    }

    await next();
  };
};

/**
 * Health check middleware for database connectivity
 * Can be used to verify D1 database connection
 */
export const healthCheck: MiddlewareHandler<HonoBindings> = async (c, next) => {
  // This middleware can be applied to health endpoints to verify system health
  try {
    // Basic D1 connectivity check
    if (c.env.DB) {
      await c.env.DB.prepare("SELECT 1").first();
    }
    await next();
  } catch (error) {
    const requestId = c.res.headers.get("X-Request-ID");

    return c.json(
      {
        success: false,
        error: "Service unavailable - database connection failed",
        ...(requestId && { requestId }),
        ...(import.meta.env.DEV && {
          details: error instanceof Error ? error.message : String(error),
        }),
      },
      HTTP_STATUS.SERVICE_UNAVAILABLE,
    );
  }
};

/**
 * API versioning middleware
 * Handles API version routing and deprecation warnings
 */
export const apiVersioning = (
  supportedVersions: string[] = ["v1"],
): MiddlewareHandler<HonoBindings> => {
  return async (c, next) => {
    const version =
      c.req.header("API-Version") || c.req.query("version") || "v1";

    if (!supportedVersions.includes(version)) {
      const requestId = c.res.headers.get("X-Request-ID");

      return c.json(
        {
          success: false,
          error: "Unsupported API version",
          ...(requestId && { requestId }),
          details: {
            requested: version,
            supported: supportedVersions,
          },
        },
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Set version header for client reference
    c.res.headers.set("API-Version", version);

    // Add deprecation warning for older versions
    if (version !== supportedVersions[supportedVersions.length - 1]) {
      c.res.headers.set("Deprecation", "true");
      c.res.headers.set(
        "Sunset",
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      ); // 90 days
    }

    await next();
  };
};

// Re-export commonly used middleware
export { prettyJSON } from "hono/pretty-json";
export { logger } from "hono/logger";
export { cors } from "hono/cors";
