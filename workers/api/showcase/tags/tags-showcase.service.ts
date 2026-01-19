import type { DrizzleD1Database } from "drizzle-orm/d1";

import type {
  FetchShowcaseTagsResult,
  ShowcaseTagItem,
} from "./tags-showcase.model";
import type { TagsShowcaseQuery } from "./tags-showcase.validator";

import * as schema from "~/database/schema";

import { getShowcaseTagsWithCounts } from "./tags-showcase.repository";

/**
 * Service to fetch showcase tags with sorting and pagination.
 * Orchestrates repository calls and business logic.
 *
 * @param db - The database instance
 * @param query - Query parameters for sorting and pagination
 * @returns Paginated tag items with showcase counts
 */
export const tagsShowcaseService = async (
  db: DrizzleD1Database<typeof schema>,
  query: TagsShowcaseQuery,
): Promise<FetchShowcaseTagsResult> => {
  // Fetch all tags with counts
  const tagsWithCount = await getShowcaseTagsWithCounts(db, query.deleted);

  // Sort tags based on query parameters
  const sortedTags = tagsWithCount.sort((a, b) => {
    const isAscending = query.sortDir === "asc";
    const multiplier = isAscending ? 1 : -1;

    if (query.sortBy === "tag") {
      return multiplier * a.name.localeCompare(b.name);
    }
    // Sort by count
    return multiplier * (a.count - b.count);
  });

  const total = sortedTags.length;

  // Apply pagination
  const startIndex = (query.page - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;
  const paginatedTags: ShowcaseTagItem[] = sortedTags
    .slice(startIndex, endIndex)
    .map((item: ShowcaseTagItem) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      count: item.count,
      createdAt: item.createdAt ?? null,
    }));

  return {
    items: paginatedTags,
    page: query.page,
    pageSize: query.pageSize,
    total,
  };
};
