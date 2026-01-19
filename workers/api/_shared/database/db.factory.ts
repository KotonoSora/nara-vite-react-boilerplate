import { drizzle } from "drizzle-orm/d1";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

/**
 * Factory to create a typed Drizzle database instance from D1 binding.
 */
export const createDbInstance = (
  d1: D1Database,
): DrizzleD1Database<typeof schema> => {
  return drizzle(d1, { schema });
};
