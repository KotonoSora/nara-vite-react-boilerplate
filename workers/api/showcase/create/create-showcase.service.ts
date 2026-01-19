import type { DrizzleD1Database } from "drizzle-orm/d1";

import type {
  CreatedShowcase,
  CreateShowcaseRecordInput,
} from "./create-showcase.model";
import type { CreateShowcaseInput } from "./create-showcase.validator";

import * as schema from "~/database/schema";

import {
  createOrGetTag,
  createShowcaseRecord,
  linkTagToShowcase,
} from "./create-showcase.repository";

/**
 * Service to create a showcase with tags.
 * Orchestrates business logic without knowing about infrastructure.
 *
 * @param db - The database instance
 * @param data - Validated showcase input
 * @returns Created showcase with all details including tags
 */
export const createShowcaseService = async (
  db: DrizzleD1Database<typeof schema>,
  data: CreateShowcaseInput,
): Promise<CreatedShowcase> => {
  // Generate ID
  const showcaseId = crypto.randomUUID();

  // Map input to database record format
  const showcaseData: CreateShowcaseRecordInput = {
    id: showcaseId,
    name: data.name,
    description: data.description,
    url: data.url,
    image: data.image,
    publishedAt: data.publishedAt,
    authorId: data.authorId,
  };

  // Create showcase record
  const createdShowcase = await createShowcaseRecord(db, showcaseData);

  // Handle tags: get or create, then link to showcase
  if (data.tags && data.tags.length > 0) {
    for (const tagName of data.tags) {
      const slug = tagName.toLowerCase().replace(/\s+/g, "-");
      const tagRecord = await createOrGetTag(db, { name: tagName, slug });
      await linkTagToShowcase(db, {
        showcaseId,
        tagId: tagRecord.id,
      });
    }
  }

  return {
    id: createdShowcase.id,
    name: createdShowcase.name,
    description: createdShowcase.description,
    url: createdShowcase.url,
    image: createdShowcase.image,
    publishedAt: createdShowcase.publishedAt,
    authorId: createdShowcase.authorId,
    tags: data.tags || [],
    createdAt: createdShowcase.createdAt,
    updatedAt: createdShowcase.updatedAt,
    deletedAt: createdShowcase.deletedAt,
    upvotes: createdShowcase.upvotes,
    downvotes: createdShowcase.downvotes,
    score: createdShowcase.score,
  };
};
