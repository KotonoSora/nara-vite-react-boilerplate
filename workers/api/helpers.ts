import { drizzle } from "drizzle-orm/d1";

import type { D1Database } from "@cloudflare/workers-types";
import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

/**
 * Create a typed Drizzle DB instance for a given schema.
 */
export function getDb<S extends Record<string, unknown>>(
  d1: D1Database,
  schema: S,
): DrizzleD1Database<S> {
  return drizzle(d1, { schema }) as DrizzleD1Database<S>;
}

/**
 * Extract Bearer token from Authorization header.
 * Returns token string or null if missing/invalid.
 */
export function extractBearerToken(c: Context): string | null {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}
