import { eq, and, gt, lt, gte } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { rateLimitLog } = schema;

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Maximum attempts per window
  blockDurationMs?: number; // How long to block after exceeding limit
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalAttempts: number;
}

// Default rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  REGISTER: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 3,
    blockDurationMs: 60 * 60 * 1000, // 1 hour
  },
  EMAIL_VERIFICATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxAttempts: 5,
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 60,
    blockDurationMs: 60 * 1000, // 1 minute
  },
  API_STRICT: {
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 10,
    blockDurationMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;

/**
 * Get client identifier from request (IP address or user ID if authenticated)
 */
export function getClientIdentifier(request: Request, userId?: number): string {
  if (userId) {
    return `user:${userId}`;
  }
  
  // Try to get real IP from various headers (for production behind proxy)
  const forwardedFor = request.headers.get("X-Forwarded-For");
  const realIp = request.headers.get("X-Real-IP");
  const cfConnectingIp = request.headers.get("CF-Connecting-IP");
  
  const ip = cfConnectingIp || realIp || forwardedFor?.split(",")[0] || "unknown";
  return `ip:${ip}`;
}

/**
 * Check and update rate limit for an endpoint
 */
export async function checkRateLimit(
  db: DrizzleD1Database<typeof schema>,
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);
  
  // Get or create current window record
  const [existingRecord] = await db
    .select()
    .from(rateLimitLog)
    .where(
      and(
        eq(rateLimitLog.identifier, identifier),
        eq(rateLimitLog.endpoint, endpoint),
        gt(rateLimitLog.windowStart, windowStart)
      )
    )
    .limit(1);

  let currentAttempts = 0;
  let resetTime = now.getTime() + config.windowMs;

  if (existingRecord) {
    currentAttempts = existingRecord.attempts;
    resetTime = existingRecord.windowStart.getTime() + config.windowMs;
    
    // Update attempts
    await db
      .update(rateLimitLog)
      .set({ 
        attempts: currentAttempts + 1,
        createdAt: now,
      })
      .where(eq(rateLimitLog.id, existingRecord.id));
      
    currentAttempts += 1;
  } else {
    // Create new window record
    await db
      .insert(rateLimitLog)
      .values({
        identifier,
        endpoint,
        attempts: 1,
        windowStart: now,
      });
    
    currentAttempts = 1;
  }

  const allowed = currentAttempts <= config.maxAttempts;
  const remaining = Math.max(0, config.maxAttempts - currentAttempts);

  return {
    allowed,
    remaining,
    resetTime,
    totalAttempts: currentAttempts,
  };
}

/**
 * Clean up old rate limit records
 */
export async function cleanupRateLimitLogs(
  db: DrizzleD1Database<typeof schema>,
  olderThanMs: number = 24 * 60 * 60 * 1000 // 24 hours
): Promise<void> {
  const cutoff = new Date(Date.now() - olderThanMs);
  
  await db
    .delete(rateLimitLog)
    .where(lt(rateLimitLog.createdAt, cutoff));
}

/**
 * Create rate limiting middleware
 */
export function createRateLimiter(
  db: DrizzleD1Database<typeof schema>,
  config: RateLimitConfig
) {
  return async function rateLimitMiddleware(
    request: Request,
    endpoint: string,
    userId?: number
  ): Promise<RateLimitResult> {
    const identifier = getClientIdentifier(request, userId);
    const result = await checkRateLimit(db, identifier, endpoint, config);
    
    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
      
      throw new Response("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.maxAttempts.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": result.resetTime.toString(),
        },
      });
    }
    
    return result;
  };
}

/**
 * Create rate limiting decorators for different endpoints
 */
export function createRateLimiters(db: DrizzleD1Database<typeof schema>) {
  return {
    login: createRateLimiter(db, RATE_LIMITS.LOGIN),
    register: createRateLimiter(db, RATE_LIMITS.REGISTER),
    passwordReset: createRateLimiter(db, RATE_LIMITS.PASSWORD_RESET),
    emailVerification: createRateLimiter(db, RATE_LIMITS.EMAIL_VERIFICATION),
    apiGeneral: createRateLimiter(db, RATE_LIMITS.API_GENERAL),
    apiStrict: createRateLimiter(db, RATE_LIMITS.API_STRICT),
  };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  result: RateLimitResult,
  config: RateLimitConfig
): Response {
  const headers = new Headers(response.headers);
  
  headers.set("X-RateLimit-Limit", config.maxAttempts.toString());
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", result.resetTime.toString());
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    headers.set("Retry-After", retryAfter.toString());
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Check if an identifier is currently blocked
 */
export async function isBlocked(
  db: DrizzleD1Database<typeof schema>,
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<boolean> {
  if (!config.blockDurationMs) {
    return false;
  }
  
  const blockEnd = new Date(Date.now() - config.blockDurationMs);
  
  const [recentViolation] = await db
    .select()
    .from(rateLimitLog)
    .where(
      and(
        eq(rateLimitLog.identifier, identifier),
        eq(rateLimitLog.endpoint, endpoint),
        gt(rateLimitLog.createdAt, blockEnd),
        gte(rateLimitLog.attempts, config.maxAttempts)
      )
    )
    .limit(1);
  
  return !!recentViolation;
}

/**
 * Manually block an identifier (for admin use)
 */
export async function blockIdentifier(
  db: DrizzleD1Database<typeof schema>,
  identifier: string,
  endpoint: string,
  durationMs: number = 60 * 60 * 1000 // 1 hour
): Promise<void> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - durationMs);
  
  await db
    .insert(rateLimitLog)
    .values({
      identifier,
      endpoint,
      attempts: 999, // High number to ensure it's blocked
      windowStart,
    });
}

/**
 * Get rate limit status for an identifier
 */
export async function getRateLimitStatus(
  db: DrizzleD1Database<typeof schema>,
  identifier: string,
  endpoint: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const windowStart = new Date(now.getTime() - config.windowMs);
  
  const [record] = await db
    .select()
    .from(rateLimitLog)
    .where(
      and(
        eq(rateLimitLog.identifier, identifier),
        eq(rateLimitLog.endpoint, endpoint),
        gt(rateLimitLog.windowStart, windowStart)
      )
    )
    .limit(1);

  if (!record) {
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetTime: now.getTime() + config.windowMs,
      totalAttempts: 0,
    };
  }

  const allowed = record.attempts <= config.maxAttempts;
  const remaining = Math.max(0, config.maxAttempts - record.attempts);
  const resetTime = record.windowStart.getTime() + config.windowMs;

  return {
    allowed,
    remaining,
    resetTime,
    totalAttempts: record.attempts,
  };
}