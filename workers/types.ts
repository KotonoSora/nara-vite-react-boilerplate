import type * as schema from "~/database/schema";
import type { DrizzleD1Database } from "drizzle-orm/d1";

/**
 * Authenticated User Context Type for API middleware
 * Reuses the database schema user type instead of redefining
 */
export type AuthenticatedUser = typeof schema.user.$inferSelect;

/**
 * Hono Context Bindings Type
 *
 * Defines the type for Cloudflare Workers bindings accessible via c.env
 * This ensures type safety when accessing environment variables and services
 * like D1 databases, KV stores, etc. in Hono handlers.
 */
export type HonoBindings = {
  Bindings: Env;
};

/**
 * Database Context Type
 *
 * Typed Drizzle database instance with our schema for use in API handlers
 */
export type DatabaseContext = DrizzleD1Database<typeof schema>;

/**
 * Standard API Response Types
 *
 * Consistent response structure for all API endpoints
 */
export type APISuccessResponse<T = unknown> = {
  success: true;
  data?: T;
  message?: string;
};

export type APIErrorResponse = {
  success: false;
  error: string;
  details?: unknown;
  requestId?: string;
};

export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;

/**
 * Common HTTP Status Codes for API responses
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
