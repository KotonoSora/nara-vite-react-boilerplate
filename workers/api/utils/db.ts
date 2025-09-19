import { drizzle } from "drizzle-orm/d1";

import type { APIErrorResponse } from "~/workers/types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import { HTTP_STATUS } from "~/workers/types";

/**
 * Enhanced helper to get a typed Drizzle D1 database instance from the Hono context.
 * Returns a Response when the DB binding is missing so handlers can early-return.
 *
 * Usage:
 * const db = getDbOrFail(c, schema);
 * if (db instanceof Response) return db;
 */
export function getDbOrFail<
  TSchema extends Record<string, unknown> = Record<string, unknown>,
>(c: Context, providedSchema?: TSchema): DrizzleD1Database<TSchema> | Response {
  if (!c.env?.DB) {
    const errorResponse: APIErrorResponse = {
      success: false,
      error: "Database not available",
    };
    return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  // If a schema is provided, pass it to drizzle for better typing.
  if (providedSchema) {
    return drizzle(c.env.DB as D1Database, {
      schema: providedSchema,
    }) as DrizzleD1Database<TSchema>;
  }

  return drizzle(c.env.DB as D1Database) as DrizzleD1Database<TSchema>;
}

/**
 * Enhanced database helper that throws HTTPException instead of returning Response
 * Use this when you prefer exception-based error handling
 *
 * Usage:
 * const db = getDbOrThrow(c, schema);
 * // No need to check for Response type
 */
export function getDbOrThrow<
  TSchema extends Record<string, unknown> = Record<string, unknown>,
>(c: Context, providedSchema?: TSchema): DrizzleD1Database<TSchema> {
  if (!c.env?.DB) {
    const errorResponse: APIErrorResponse = {
      success: false,
      error: "Database not available",
    };
    throw new Error(JSON.stringify(errorResponse));
  }

  if (providedSchema) {
    return drizzle(c.env.DB as D1Database, {
      schema: providedSchema,
    }) as DrizzleD1Database<TSchema>;
  }

  return drizzle(c.env.DB as D1Database) as DrizzleD1Database<TSchema>;
}

/**
 * Database connection pool helper (for future use with connection pooling)
 * Currently just returns the standard connection, but can be enhanced later
 */
export function getPooledDb<
  TSchema extends Record<string, unknown> = Record<string, unknown>,
>(c: Context, providedSchema?: TSchema): DrizzleD1Database<TSchema> | Response {
  // For now, just delegate to the standard helper
  // In the future, this could implement connection pooling strategies
  return getDbOrFail(c, providedSchema);
}

/**
 * Transaction helper for database operations
 * Provides a clean way to handle database transactions in Hono handlers
 */
export async function withTransaction<T>(
  db: DrizzleD1Database,
  callback: (tx: DrizzleD1Database) => Promise<T>,
): Promise<T> {
  // D1 doesn't support transactions yet, but this provides a consistent interface
  // When D1 adds transaction support, we can implement it here
  return await callback(db);
}
