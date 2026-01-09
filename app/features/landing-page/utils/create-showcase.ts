import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { showcase, showcaseTag } = schema;

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

  // Insert tags
  if (data.tags && data.tags.length > 0) {
    const tagsToInsert = data.tags.map((tag) => ({
      id: crypto.randomUUID(),
      showcaseId: showcaseId,
      tag,
    }));

    await db.insert(showcaseTag).values(tagsToInsert);
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
