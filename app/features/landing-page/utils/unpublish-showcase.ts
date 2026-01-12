import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";

/**
 * Unpublishes a showcase by removing publishedAt timestamp.
 * Marks a published showcase as draft and hides from public.
 */
export async function unpublishShowcase(
  db: DrizzleD1Database<typeof dbSchema>,
  showcaseId: string,
): Promise<typeof dbSchema.showcase.$inferSelect | undefined> {
  const result = await db
    .update(dbSchema.showcase)
    .set({ publishedAt: null })
    .where(eq(dbSchema.showcase.id, showcaseId))
    .returning()
    .get();

  return result;
}
