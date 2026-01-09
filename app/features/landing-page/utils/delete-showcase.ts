import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as dbSchema from "~/database/schema";

/**
 * Soft deletes a showcase by setting deletedAt timestamp.
 * Prevents actual deletion of data while marking as removed.
 */
export async function deleteShowcase(
  db: DrizzleD1Database<typeof dbSchema>,
  showcaseId: string,
): Promise<void> {
  await db
    .update(dbSchema.showcase)
    .set({ deletedAt: new Date() })
    .where(eq(dbSchema.showcase.id, showcaseId))
    .execute();
}
