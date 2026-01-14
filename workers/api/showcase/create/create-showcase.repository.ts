import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type {
  NewShowcaseTag,
  NewTag,
  Showcase,
  Tag,
} from "~/database/contracts";

import type { CreateShowcaseRecordInput } from "./create-showcase.model";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

/**
 * Creates a showcase record in the database.
 * Pure data access - no business logic.
 */
export async function createShowcaseRecord(
  db: DrizzleD1Database<typeof schema>,
  data: CreateShowcaseRecordInput,
): Promise<Showcase> {
  const result = await db.insert(showcase).values(data).returning();
  return result[0];
}

/**
 * Gets an existing tag by slug, or creates it if not found.
 * Pure data access - no business logic.
 */
export async function createOrGetTag(
  db: DrizzleD1Database<typeof schema>,
  data: Pick<NewTag, "name" | "slug">,
): Promise<Tag> {
  const existingTag = await db
    .select()
    .from(tag)
    .where(eq(tag.slug, data.slug))
    .get();
  if (existingTag) return existingTag;
  const tagId = crypto.randomUUID();
  const result = await db
    .insert(tag)
    .values({ id: tagId, name: data.name, slug: data.slug })
    .returning();
  return result[0];
}

/**
 * Links a tag to a showcase via the junction table.
 * Pure data access - no business logic.
 */
export async function linkTagToShowcase(
  db: DrizzleD1Database<typeof schema>,
  data: Pick<NewShowcaseTag, "showcaseId" | "tagId">,
): Promise<void> {
  await db.insert(showcaseTag).values(data);
}
