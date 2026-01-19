import { asc, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { TagWithCount } from "./tags-showcase.model";

import * as schema from "~/database/schema";

/**
 * Fetches all showcase tags with aggregated showcase counts.
 * Pure data access - no business logic.
 */
export const getShowcaseTagsWithCounts = async (
  db: DrizzleD1Database<typeof schema>,
  deleted?: "true" | "false",
): Promise<TagWithCount[]> => {
  const { showcase, showcaseTag, tag } = schema;

  // Filter by soft delete status
  const deletedFilter =
    deleted === "true"
      ? isNotNull(showcase.deletedAt)
      : isNull(showcase.deletedAt);

  // Count distinct showcases per tag
  const countColumn = sql<number>`count(distinct ${showcase.id})`;

  return await db
    .select({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: countColumn,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      deletedAt: tag.deletedAt,
    })
    .from(tag)
    .leftJoin(showcaseTag, eq(showcaseTag.tagId, tag.id))
    .leftJoin(showcase, eq(showcaseTag.showcaseId, showcase.id))
    .where(deletedFilter)
    .groupBy(
      tag.id,
      tag.name,
      tag.slug,
      tag.createdAt,
      tag.updatedAt,
      tag.deletedAt,
    )
    .all();
};
