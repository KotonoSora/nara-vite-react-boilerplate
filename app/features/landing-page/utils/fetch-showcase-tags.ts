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
  showcaseId: string;
  tag: string;
  count: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
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
  const { showcase, showcaseTag } = schema;

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
        ? asc(showcaseTag.tag)
        : desc(showcaseTag.tag)
      : params.sortDir === "asc"
        ? asc(countColumn)
        : desc(countColumn);

  // Fetch tags with counts, filtered by deleted status
  const tagsWithCount = await db
    .select({
      id: showcaseTag.id,
      showcaseId: showcaseTag.showcaseId,
      tag: showcaseTag.tag,
      count: countColumn,
      createdAt: showcaseTag.createdAt,
      updatedAt: showcaseTag.updatedAt,
      deletedAt: showcaseTag.deletedAt,
    })
    .from(showcaseTag)
    .leftJoin(showcase, eq(showcaseTag.showcaseId, showcase.id))
    .where(deletedFilter)
    .groupBy(showcaseTag.tag)
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
      updatedAt: item.updatedAt ?? undefined,
      deletedAt: item.deletedAt ?? undefined,
    }));

  return {
    items: paginatedTags,
    page: params.page,
    pageSize: params.pageSize,
    total,
  };
}
