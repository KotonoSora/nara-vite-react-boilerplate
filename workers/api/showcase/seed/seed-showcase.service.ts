import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { SeedShowcaseItem } from "./seed-showcase.model";

import * as schema from "~/database/schema";

import {
  clearShowcases,
  getOrCreateTag,
  insertShowcaseRecords,
  linkShowcaseToTag,
} from "./seed-showcase.repository";

/**
 * Service to seed showcases into the database.
 * Orchestrates showcase and tag creation.
 *
 * @param db - The database instance
 * @param showcases - Array of showcase data to seed
 * @returns Count of seeded showcases
 */
export async function seedShowcaseService(
  db: DrizzleD1Database<typeof schema>,
  showcases: SeedShowcaseItem[],
): Promise<number> {
  if (!showcases?.length) return 0;

  try {
    // Clear existing data
    await clearShowcases(db);

    // Add IDs to showcases
    const showcasesWithIds = showcases.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      image: item.image ?? null,
      authorId: item.authorId ?? null,
      createdAt: item.createdAt ?? null,
      updatedAt: item.updatedAt ?? null,
      deletedAt: item.deletedAt ?? null,
      publishedAt: item.publishedAt ?? null,
      upvotes: item.upvotes ?? 0,
      downvotes: item.downvotes ?? 0,
      score: item.score ?? 0,
    }));

    // Insert showcase records
    await insertShowcaseRecords(db, showcasesWithIds);

    // Create/link tags
    for (const { id: showcaseId, tags: tagNames } of showcasesWithIds) {
      if (!tagNames?.length) continue;

      for (const tagName of tagNames) {
        const tagId = await getOrCreateTag(db, tagName);
        await linkShowcaseToTag(db, showcaseId, tagId);
      }
    }

    return showcasesWithIds.length;
  } catch (error) {
    console.error("Error seeding showcases:", error);
    throw error;
  }
}
