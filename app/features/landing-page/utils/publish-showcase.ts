import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";

/**
 * Publishes a showcase by setting publishedAt to current timestamp.
 * Marks a draft showcase as published and visible to public.
 */
export async function publishShowcase(
  db: DrizzleD1Database<typeof dbSchema>,
  showcaseId: string,
): Promise<dbSchema.Showcase | undefined> {
  const result = await db
    .update(dbSchema.showcase)
    .set({ publishedAt: new Date() })
    .where(eq(dbSchema.showcase.id, showcaseId))
    .returning()
    .get();

  return result;
}
