import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

export type UpdateShowcaseData = {
  showcaseId: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  tags: string[];
};

export type UpdatedShowcase = {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  authorId?: string;
  tags: string[];
  updatedAt?: Date;
};

/**
 * Updates an existing showcase in the database with associated tags.
 * Removes old tag associations and creates new ones.
 *
 * @param db - The database instance.
 * @param data - Showcase data including ID, fields to update, and tags.
 * @returns Updated showcase with all details including tags.
 */
export async function updateShowcase(
  db: DrizzleD1Database<typeof schema>,
  data: UpdateShowcaseData,
): Promise<UpdatedShowcase> {
  const { showcaseId, tags: tagNames, ...updateFields } = data;

  // Update showcase
  const result = await db
    .update(showcase)
    .set({
      ...updateFields,
      updatedAt: new Date(),
    })
    .where(eq(showcase.id, showcaseId))
    .returning()
    .get();

  if (!result) {
    throw new Error("Showcase not found");
  }

  // Remove existing tag associations
  await db.delete(showcaseTag).where(eq(showcaseTag.showcaseId, showcaseId));

  // Process tags: create tags if they don't exist, then link to showcase
  if (tagNames.length > 0) {
    const tagIds: string[] = [];

    for (const tagName of tagNames) {
      // Generate slug from tag name
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");

      // Check if tag exists by slug
      const existingTag = await db
        .select()
        .from(tag)
        .where(eq(tag.slug, slug))
        .get();

      let tagId: string;

      if (existingTag) {
        tagId = existingTag.id;
      } else {
        // Create new tag
        tagId = crypto.randomUUID();
        await db.insert(tag).values({
          id: tagId,
          name: tagName,
          slug: slug,
        });
      }

      tagIds.push(tagId);
    }

    // Insert into showcase_tags junction table
    if (tagIds.length > 0) {
      const junctionRecords = tagIds.map((tagId) => ({
        showcaseId: showcaseId,
        tagId: tagId,
      }));

      await db.insert(showcaseTag).values(junctionRecords);
    }
  }

  // Fetch updated showcase with tags
  const showcaseWithTags = await db
    .select({
      id: showcase.id,
      name: showcase.name,
      description: showcase.description,
      url: showcase.url,
      image: showcase.image,
      publishedAt: showcase.publishedAt,
      authorId: showcase.authorId,
      updatedAt: showcase.updatedAt,
      tagName: tag.name,
    })
    .from(showcase)
    .leftJoin(showcaseTag, eq(showcase.id, showcaseTag.showcaseId))
    .leftJoin(tag, eq(showcaseTag.tagId, tag.id))
    .where(eq(showcase.id, showcaseId))
    .all();

  const updatedShowcase: UpdatedShowcase = {
    id: result.id,
    name: result.name,
    description: result.description,
    url: result.url,
    image: result.image ?? undefined,
    publishedAt: result.publishedAt ?? undefined,
    authorId: result.authorId ?? undefined,
    updatedAt: result.updatedAt ?? undefined,
    tags: showcaseWithTags
      .map((row) => row.tagName)
      .filter((t): t is string => t !== null),
  };

  return updatedShowcase;
}
