import { HTTPException } from "hono/http-exception";

import type { APIErrorResponse, HonoBindings } from "~/workers/types";
import type { Context, MiddlewareHandler } from "hono";

import { HTTP_STATUS } from "~/workers/types";

/**
 * JWT Token utilities for API authentication
 * Simple implementation without external dependencies
 */
export const tokenUtils = {
  /**
   * Creates a simple JWT-like token for API authentication
   * NOTE: This is a simplified implementation. Use a proper JWT library in production.
   */
  createToken(
    payload: { userId: number; role: string },
    expiresInSeconds: number = 3600,
  ): string {
    const header = {
      typ: "JWT",
      alg: "HS256",
    };

    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const tokenPayload = {
      ...payload,
      exp,
      iat: Math.floor(Date.now() / 1000),
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(tokenPayload));

    // Simple signature (use proper HMAC-SHA256 in production)
    const signature = btoa(
      `${encodedHeader}.${encodedPayload}.simple_signature`,
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  /**
   * Validates and decodes a simple token
   * NOTE: This is a simplified implementation. Use a proper JWT library in production.
   */
  validateToken(
    token: string,
  ): { userId: number; role: string; exp: number } | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      if (!payload.userId || !payload.exp || Date.now() / 1000 > payload.exp) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  },
};

/**
 * Enhanced error handling middleware with proper type safety and standardized responses
 * Includes request ID tracing and structured error logging
 */
export const errorHandler: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  try {
    await next();
  } catch (err) {
    const requestId = c.res.headers.get("X-Request-ID");

    if (err instanceof HTTPException) {
      // Try to parse structured error message, fallback to simple message
      let errorResponse: APIErrorResponse;
      try {
        errorResponse = JSON.parse(err.message);
      } catch {
        errorResponse = {
          success: false,
          error: err.message,
          ...(requestId && { requestId }),
        };
      }

      // Log error with context
      if (import.meta.env.DEV) {
        console.error(`[${requestId}] HTTP Exception:`, err.message);
      }

      return c.json(errorResponse, err.status);
    }

    // Handle development vs production error messages
    const isDev = import.meta.env.DEV;

    if (isDev) {
      console.error(`[${requestId}] Unhandled error in worker:`, err);
    } else {
      // Structured error logging for production monitoring
      console.error(
        JSON.stringify({
          requestId,
          error: "Unhandled worker error",
          timestamp: new Date().toISOString(),
          path: c.req.path,
          method: c.req.method,
        }),
      );
    }

    const errorResponse: APIErrorResponse = {
      success: false,
      error: isDev
        ? ((err as Error)?.message ?? "Internal Server Error")
        : "Internal Server Error",
      ...(requestId && { requestId }),
      ...(isDev && { details: err }),
    };

    return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Global error handler to be used with app.onError()
 * Provides consistent error response format across the application
 * Includes proper request tracing and environment-aware logging
 */
export function onError(err: unknown, c: Context): Response {
  const requestId = c.res.headers.get("X-Request-ID");

  if (err instanceof HTTPException) {
    // Try to parse structured error message, fallback to simple message
    let errorResponse: APIErrorResponse;
    try {
      errorResponse = JSON.parse(err.message);
    } catch {
      errorResponse = {
        success: false,
        error: err.message,
        ...(requestId && { requestId }),
      };
    }
    return c.json(errorResponse, err.status);
  }

  // Handle development vs production error logging
  const isDev = import.meta.env.DEV;

  if (isDev) {
    console.error(`[${requestId}] Unexpected error:`, err);
  } else {
    // Structured logging for production
    console.error(
      JSON.stringify({
        requestId,
        error: "Global error handler triggered",
        timestamp: new Date().toISOString(),
        path: c.req.path,
        method: c.req.method,
        userAgent: c.req.header("User-Agent"),
      }),
    );
  }

  const errorResponse: APIErrorResponse = {
    success: false,
    error: "Internal Server Error",
    ...(requestId && { requestId }),
    ...(isDev && { details: err instanceof Error ? err.message : String(err) }),
  };

  return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

/**
 * In-memory rate limiting store
 * Stores request counts per IP with automatic cleanup
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Cleanup expired rate limit entries
 * Prevents memory leaks by removing old entries
 */
function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * In-memory rate limiting middleware
 * Simple, effective rate limiting without external dependencies
 */
export const rateLimit = (
  requests: number,
  windowMs: number,
): MiddlewareHandler<HonoBindings> => {
  return async (c, next) => {
    // Get client IP for rate limiting key
    const clientIP =
      c.req.header("CF-Connecting-IP") ||
      c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ||
      c.req.header("X-Real-IP") ||
      "unknown";

    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetTime = windowStart + windowMs;
    const rateLimitKey = `${clientIP}:${windowStart}`;

    // Periodic cleanup (every 100 requests to avoid performance impact)
    if (rateLimitStore.size > 100 && Math.random() < 0.01) {
      cleanupRateLimitStore();
    }

    // Get or create rate limit entry
    let entry = rateLimitStore.get(rateLimitKey);
    if (!entry) {
      entry = { count: 0, resetTime };
      rateLimitStore.set(rateLimitKey, entry);
    }

    // Check if rate limit exceeded
    if (entry.count >= requests) {
      const requestId = c.res.headers.get("X-Request-ID");

      // Log rate limit violation
      if (import.meta.env.DEV) {
        console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIP}`);
      } else {
        console.error(
          JSON.stringify({
            requestId,
            error: "Rate limit exceeded",
            clientIP,
            requestCount: entry.count,
            limit: requests,
            windowMs,
            timestamp: new Date().toISOString(),
          }),
        );
      }

      // Return rate limit error
      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Too Many Requests",
        ...(requestId && { requestId }),
        ...(import.meta.env.DEV && {
          details: {
            limit: requests,
            window: `${windowMs}ms`,
            current: entry.count,
            resetTime: new Date(resetTime).toISOString(),
            retryAfter: Math.ceil((resetTime - now) / 1000),
          },
        }),
      };

      // Set rate limit headers
      c.res.headers.set("X-RateLimit-Limit", requests.toString());
      c.res.headers.set("X-RateLimit-Remaining", "0");
      c.res.headers.set(
        "X-RateLimit-Reset",
        Math.ceil(resetTime / 1000).toString(),
      );
      c.res.headers.set(
        "Retry-After",
        Math.ceil((resetTime - now) / 1000).toString(),
      );

      return c.json(errorResponse, HTTP_STATUS.TOO_MANY_REQUESTS);
    }

    // Increment request count
    entry.count++;

    // Set rate limit headers for successful requests
    c.res.headers.set("X-RateLimit-Limit", requests.toString());
    c.res.headers.set(
      "X-RateLimit-Remaining",
      Math.max(0, requests - entry.count).toString(),
    );
    c.res.headers.set(
      "X-RateLimit-Reset",
      Math.ceil(resetTime / 1000).toString(),
    );

    await next();
  };
};

/**
 * Request logging middleware with structured logging
 * Provides detailed logging for API requests with request ID tracing
 */
export const requestLogger: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const requestId = c.res.headers.get("X-Request-ID");

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  // Structured logging for better monitoring
  const logData = {
    requestId,
    method,
    path,
    status,
    duration: `${duration}ms`,
    timestamp: new Date().toISOString(),
  };

  if (import.meta.env.DEV) {
    // Pretty console output for development
    console.log(`[${requestId}] ${method} ${path} ${status} ${duration}ms`);
  } else {
    // JSON structured logging for production
    console.log(JSON.stringify(logData));
  }
};

/**
 * Authentication middleware for protected routes
 * Validates session tokens and sets user context for API routes
 */
export const authMiddleware: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  const requestId = c.res.headers.get("X-Request-ID");

  // Check for Authorization header (Bearer token) or session cookie
  const authHeader = c.req.header("Authorization");
  const sessionCookie = c.req.header("Cookie");

  if (!authHeader && !sessionCookie) {
    const errorResponse: APIErrorResponse = {
      success: false,
      error: "Authentication required",
      ...(requestId && { requestId }),
    };
    return c.json(errorResponse, HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    let user = null;

    // Handle Bearer token authentication (for API clients)
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      // Validate token using utility function
      const payload = tokenUtils.validateToken(token);

      if (!payload) {
        throw new Error("Invalid or expired token");
      }

      // Get user from database using the context's database connection
      const { drizzle } = await import("drizzle-orm/d1");
      const { eq } = await import("drizzle-orm");
      const schema = await import("~/database/schema");

      const db = drizzle(c.env.DB, { schema });
      user = await db
        .select({
          id: schema.user.id,
          email: schema.user.email,
          name: schema.user.name,
          role: schema.user.role,
          emailVerified: schema.user.emailVerified,
        })
        .from(schema.user)
        .where(eq(schema.user.id, payload.userId))
        .get();
    }

    // Handle session cookie authentication (for web clients)
    else if (sessionCookie) {
      // Parse session using the same session storage as the main app
      const { createCookieSessionStorage } = await import("react-router");

      const authSessionStorage = createCookieSessionStorage({
        cookie: {
          name: "__nara_auth",
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secrets: ["__nara_auth"],
          secure: import.meta.env.PROD,
          maxAge: 60 * 60 * 24 * 30, // 30 days
        },
      });

      const session = await authSessionStorage.getSession(sessionCookie);
      const userId = session.get("userId");

      if (typeof userId !== "number") {
        throw new Error("Invalid session");
      }

      // Get user from database
      const { drizzle } = await import("drizzle-orm/d1");
      const { eq } = await import("drizzle-orm");
      const schema = await import("~/database/schema");

      const db = drizzle(c.env.DB, { schema });
      user = await db
        .select({
          id: schema.user.id,
          email: schema.user.email,
          name: schema.user.name,
          role: schema.user.role,
          emailVerified: schema.user.emailVerified,
        })
        .from(schema.user)
        .where(eq(schema.user.id, userId))
        .get();
    }

    // Validate user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Authentication successful - proceed to next middleware
    await next();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`[${requestId}] Auth error:`, error);
    }

    const errorResponse: APIErrorResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
      ...(requestId && { requestId }),
    };
    return c.json(errorResponse, HTTP_STATUS.UNAUTHORIZED);
  }
};

/**
 * Performance monitoring middleware
 * Tracks response times and adds performance headers
 */
export const performanceMiddleware: MiddlewareHandler<HonoBindings> = async (
  c,
  next,
) => {
  const start = performance.now();

  await next();

  const duration = performance.now() - start;

  // Add performance headers
  c.res.headers.set("X-Response-Time", `${duration.toFixed(2)}ms`);

  // Log slow requests (> 1000ms)
  if (duration > 1000) {
    const requestId = c.res.headers.get("X-Request-ID");
    const logData = {
      requestId,
      type: "slow_request",
      method: c.req.method,
      path: c.req.path,
      duration: `${duration.toFixed(2)}ms`,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.warn(
        `[${requestId}] Slow request: ${c.req.method} ${c.req.path} ${duration.toFixed(2)}ms`,
      );
    } else {
      console.warn(JSON.stringify(logData));
    }
  }
};
