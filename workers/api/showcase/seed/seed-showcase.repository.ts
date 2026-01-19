import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { Showcase } from "~/database/contracts";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

/**
 * Inserts showcase records into the database.
 * Pure data access - no business logic.
 */
export async function insertShowcaseRecords(
  db: DrizzleD1Database<typeof schema>,
  showcases: Array<Showcase & { tags: string[] }>,
  chunkSize: number = 10,
): Promise<void> {
  const showcasesWithoutTags = showcases.map(
    ({ tags: _tags, ...rest }) => rest,
  );
  for (let i = 0; i < showcasesWithoutTags.length; i += chunkSize) {
    const batch = showcasesWithoutTags.slice(i, i + chunkSize);
    await db.insert(showcase).values(batch).run();
  }
}

/**
 * Clears all showcase and showcase_tag records from the database.
 * Pure data access - no business logic.
 */
export const clearShowcases = async (
  db: DrizzleD1Database<typeof schema>,
): Promise<void> => {
  await db.delete(showcaseTag).run();
  await db.delete(showcase).run();
};

/**
 * Gets or creates a tag by name.
 * Pure data access - no business logic.
 */
export const getOrCreateTag = async (
  db: DrizzleD1Database<typeof schema>,
  tagName: string,
): Promise<string> => {
  const slug = tagName.toLowerCase().replace(/\s+/g, "-");

  const existingTag = await db
    .select()
    .from(tag)
    .where(eq(tag.slug, slug))
    .get();

  if (existingTag) {
    return existingTag.id;
  }

  const tagId = crypto.randomUUID();
  await db.insert(tag).values({
    id: tagId,
    name: tagName,
    slug,
  });

  return tagId;
};

/**
 * Links a showcase to a tag via junction table.
 * Pure data access - no business logic.
 */
export const linkShowcaseToTag = async (
  db: DrizzleD1Database<typeof schema>,
  showcaseId: string,
  tagId: string,
): Promise<void> => {
  await db.insert(showcaseTag).values({
    showcaseId,
    tagId,
  });
};
