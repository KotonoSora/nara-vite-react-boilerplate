import { eq } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { showcase, showcaseTag, tag } = schema;

export type CreateShowcaseData = {
  name: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  tags: string[];
  authorId?: string;
};

export type CreatedShowcase = {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  publishedAt?: Date;
  authorId?: string;
  tags: string[];
  createdAt?: Date;
};

/**
 * Creates a new showcase in the database with associated tags.
 *
 * @param db - The database instance.
 * @param data - Showcase data including tags and optional authorId.
 * @returns Created showcase with all details including tags.
 */
export async function createShowcase(
  db: DrizzleD1Database<typeof schema>,
  data: CreateShowcaseData,
): Promise<CreatedShowcase> {
  // Generate a simple ID (in production, use UUID or nanoid)
  const showcaseId = crypto.randomUUID();

  // Insert showcase
  const result = await db
    .insert(showcase)
    .values({
      id: showcaseId,
      name: data.name,
      description: data.description,
      url: data.url,
      image: data.image,
      publishedAt: data.publishedAt,
      authorId: data.authorId,
    })
    .returning();

  const createdShowcase = result[0];

  // Insert tags: create tags if they don't exist, then link to showcase
  if (data.tags && data.tags.length > 0) {
    const tagIds: string[] = [];

    for (const tagName of data.tags) {
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

  return {
    id: createdShowcase.id,
    name: createdShowcase.name,
    description: createdShowcase.description,
    url: createdShowcase.url,
    image: createdShowcase.image ?? undefined,
    publishedAt: createdShowcase.publishedAt ?? undefined,
    authorId: createdShowcase.authorId ?? undefined,
    tags: data.tags || [],
    createdAt: createdShowcase.createdAt ?? undefined,
  };
}
