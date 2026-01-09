import { asc, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

type FetchShowcaseTagsParams = {
  page: number;
  pageSize: number;
  sortBy: "tag" | "count";
  sortDir: "asc" | "desc";
  deleted?: "true" | "false";
};

type ShowcaseTagItem = {
  id: string;
  name: string;
  slug: string;
  count: number;
  createdAt?: Date;
};

type FetchShowcaseTagsResult = {
  items: ShowcaseTagItem[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Fetches showcase tags with aggregated counts from the database.
 *
 * @param db - The database instance.
 * @param params - Query parameters for filtering and pagination.
 * @returns Paginated tag items with showcase counts and total count.
 */
export async function fetchShowcaseTags(
  db: DrizzleD1Database<typeof schema>,
  params: FetchShowcaseTagsParams,
): Promise<FetchShowcaseTagsResult> {
  const { showcase, showcaseTag, tag } = schema;

  // Filter by soft delete status
  const deletedFilter =
    params.deleted === "true"
      ? isNotNull(showcase.deletedAt)
      : isNull(showcase.deletedAt);

  // Count distinct showcases per tag
  const countColumn = sql<number>`count(distinct ${showcase.id})`;

  // Determine sort order
  const orderBy =
    params.sortBy === "tag"
      ? params.sortDir === "asc"
        ? asc(tag.name)
        : desc(tag.name)
      : params.sortDir === "asc"
        ? asc(countColumn)
        : desc(countColumn);

  // Fetch tags with counts, filtered by deleted status
  const tagsWithCount = await db
    .select({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: countColumn,
      createdAt: tag.createdAt,
    })
    .from(tag)
    .leftJoin(showcaseTag, eq(showcaseTag.tagId, tag.id))
    .leftJoin(showcase, eq(showcaseTag.showcaseId, showcase.id))
    .where(deletedFilter)
    .groupBy(tag.id, tag.name, tag.slug, tag.createdAt)
    .orderBy(orderBy)
    .all();

  const total = tagsWithCount.length;

  // Apply pagination in memory
  const startIndex = (params.page - 1) * params.pageSize;
  const endIndex = startIndex + params.pageSize;
  const paginatedTags = tagsWithCount
    .slice(startIndex, endIndex)
    .map((item) => ({
      ...item,
      createdAt: item.createdAt ?? undefined,
    }));

  return {
    items: paginatedTags,
    page: params.page,
    pageSize: params.pageSize,
    total,
  };
}
