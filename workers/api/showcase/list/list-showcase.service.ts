import { and, inArray } from "drizzle-orm";

import type { SQL } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import type {
  FetchShowcasesParams,
  FetchShowcasesResult,
  ShowcaseItem,
} from "./list-showcase.model";
import type { ListShowcaseQuery } from "./list-showcase.validator";

import * as schema from "~/database/schema";

import {
  buildFilterClauses,
  getAuthorsByIds,
  getShowcaseIdsByTags,
  getShowcaseRows,
  getShowcasesCount,
  getTagsForShowcases,
  getUserIdsByName,
} from "./list-showcase.repository";

/**
 * Service to list showcases with filtering, sorting, and pagination.
 * Orchestrates repository calls and business logic.
 *
 * @param db - The database instance
 * @param query - Query parameters for filtering, sorting, and pagination
 * @returns Paginated showcase items with total count
 */
export const listShowcaseService = async (
  db: DrizzleD1Database<typeof schema>,
  query: ListShowcaseQuery,
): Promise<FetchShowcasesResult> => {
  const params: FetchShowcasesParams = {
    page: query.page,
    pageSize: query.pageSize,
    sortBy: query.sortBy,
    sortDir: query.sortDir,
    search: query.search,
    tags: query.tags,
    authorId: query.authorId,
    authorName: query.authorName,
    publishedAfter: query.publishedAfter,
    publishedBefore: query.publishedBefore,
    deleted: query.deleted,
    published: query.published,
    minScore: query.minScore,
    viewerId: query.viewerId,
  };

  // Build base filter clauses
  const clauses = buildFilterClauses(params);
  const allConditions: SQL[] = [...clauses];

  // Apply tag filters
  if (params.tags && params.tags.length > 0) {
    const showcaseIdsWithTags = await getShowcaseIdsByTags(db, params.tags);
    if (showcaseIdsWithTags.length === 0) {
      return {
        items: [],
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
      };
    }
    const { showcase } = schema;
    allConditions.push(inArray(showcase.id, showcaseIdsWithTags));
  }

  // Apply author name filter
  if (params.authorName) {
    const authorIds = await getUserIdsByName(db, params.authorName);
    if (authorIds.length === 0) {
      return {
        items: [],
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
      };
    }
    const { showcase } = schema;
    allConditions.push(inArray(showcase.authorId, authorIds));
  }

  // Combine all conditions
  const finalWhere = allConditions.length
    ? allConditions.length === 1
      ? allConditions[0]
      : and(...allConditions)
    : undefined;

  // Get total count
  const totalCount = await getShowcasesCount(db, finalWhere);

  if (totalCount === 0) {
    return {
      items: [],
      page: params.page,
      pageSize: params.pageSize,
      total: 0,
    };
  }

  // Get paginated showcase rows
  const paginatedShowcases = await getShowcaseRows(db, params, finalWhere);

  if (paginatedShowcases.length === 0) {
    return {
      items: [],
      page: params.page,
      pageSize: params.pageSize,
      total: totalCount,
    };
  }

  // Get tags and author details
  const pageIds = paginatedShowcases.map((r) => r.id);
  const tagRows = await getTagsForShowcases(db, pageIds);
  const authorIds = [
    ...new Set(
      paginatedShowcases
        .map((r) => r.authorId)
        .filter((id): id is string => !!id),
    ),
  ];

  const authorRows =
    authorIds.length > 0 ? await getAuthorsByIds(db, authorIds) : [];
  const authorMap = new Map(authorRows.map((a) => [a.id, a]));

  // Build final showcase items
  const map = new Map<string, ShowcaseItem>();

  for (const row of paginatedShowcases) {
    const author = row.authorId ? authorMap.get(row.authorId) : undefined;

    map.set(row.id, {
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      image: row.image ?? null,
      tags: [],
      authorId: row.authorId ?? null,
      author: author
        ? {
            id: author.id,
            email: author.email,
            name: author.name,
          }
        : undefined,
      upvotes: row.upvotes ?? 0,
      downvotes: row.downvotes ?? 0,
      score: row.score ?? 0,
      publishedAt: row.publishedAt ?? null,
      createdAt: row.createdAt ?? null,
      updatedAt: row.updatedAt ?? null,
      deletedAt: row.deletedAt ?? null,
      userVote: row.userVote ?? undefined,
    });
  }

  // Attach tags to showcases
  for (const tr of tagRows) {
    if (map.has(tr.showcaseId)) {
      map.get(tr.showcaseId)!.tags.push(tr.tagName);
    }
  }

  return {
    items: Array.from(map.values()),
    page: params.page,
    pageSize: params.pageSize,
    total: totalCount,
  };
};
