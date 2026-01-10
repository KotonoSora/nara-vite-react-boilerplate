import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";

import type { SQL } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

export type FetchShowcasesParams = {
  page: number;
  pageSize: number;
  sortBy: "name" | "createdAt" | "publishedAt";
  sortDir: "asc" | "desc";
  search?: string;
  tags?: string[];
  authorId?: string;
  authorName?: string;
  publishedAfter?: Date;
  publishedBefore?: Date;
  deleted?: "true" | "false";
  published?: "true" | "false";
  minScore?: number;
};

export type ShowcaseItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
  authorId?: string;
  author?: { id: string; email: string; name: string };
  upvotes?: number;
  downvotes?: number;
  score?: number;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  userVote?: -1 | 1;
};

export type FetchShowcasesResult = {
  items: ShowcaseItem[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Fetches showcases from the database with filtering, pagination, and sorting.
 *
 * @param db - The database instance.
 * @param params - Query parameters for filtering and pagination.
 * @returns Paginated showcase items with total count.
 */
export async function fetchShowcases(
  db: DrizzleD1Database<typeof schema>,
  params: FetchShowcasesParams,
): Promise<FetchShowcasesResult> {
  const { showcase, showcaseTag, tag, user, showcaseVote } = schema;

  const whereClauses: SQL[] = [];

  // Text search on name and description
  if (params.search) {
    whereClauses.push(
      or(
        like(showcase.name, `%${params.search}%`),
        like(showcase.description, `%${params.search}%`),
      )!,
    );
  }

  // Filter by author ID
  if (params.authorId) {
    whereClauses.push(eq(showcase.authorId, params.authorId));
  }

  // Filter by published date range
  if (params.publishedAfter) {
    whereClauses.push(gte(showcase.publishedAt, params.publishedAfter));
  }

  if (params.publishedBefore) {
    whereClauses.push(lte(showcase.publishedAt, params.publishedBefore));
  }

  // Filter by soft delete status
  if (params.deleted === "true") {
    whereClauses.push(isNotNull(showcase.deletedAt));
  } else {
    whereClauses.push(isNull(showcase.deletedAt));
  }

  // Filter by published status
  if (params.published === "true") {
    whereClauses.push(isNotNull(showcase.publishedAt));
  } else if (params.published === "false") {
    whereClauses.push(isNull(showcase.publishedAt));
  }

  // Filter by minimum score
  if (params.minScore !== undefined) {
    whereClauses.push(gte(showcase.score, params.minScore));
  }

  const allConditions: typeof whereClauses = [...whereClauses];

  // Filter by tags (OR logic - showcase has ANY matching tag)
  if (params.tags && params.tags.length > 0) {
    const showcaseIdsWithTags = await db
      .select({ showcaseId: showcaseTag.showcaseId })
      .from(showcaseTag)
      .innerJoin(tag, eq(showcaseTag.tagId, tag.id))
      .where(inArray(tag.name, params.tags))
      .groupBy(showcaseTag.showcaseId)
      .all();

    const validIds = showcaseIdsWithTags.map((r) => r.showcaseId);
    if (validIds.length === 0) {
      return {
        items: [],
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
      };
    }
    allConditions.push(inArray(showcase.id, validIds));
  }

  // Filter by author name
  if (params.authorName) {
    const authorsWithName = await db
      .select({ id: user.id })
      .from(user)
      .where(like(user.name, `%${params.authorName}%`))
      .all();

    const validAuthorIds = authorsWithName.map((a) => a.id);
    if (validAuthorIds.length === 0) {
      return {
        items: [],
        page: params.page,
        pageSize: params.pageSize,
        total: 0,
      };
    }
    allConditions.push(inArray(showcase.authorId, validAuthorIds));
  }

  // Combine all filter conditions
  const finalWhere = allConditions.length
    ? allConditions.length === 1
      ? allConditions[0]
      : and(...allConditions)
    : undefined;

  // Determine sort column and direction
  const orderColumn =
    params.sortBy === "name"
      ? showcase.name
      : params.sortBy === "publishedAt"
        ? showcase.publishedAt
        : showcase.createdAt;
  const orderBy =
    params.sortDir === "asc" ? asc(orderColumn) : desc(orderColumn);

  // Get total count of filtered results
  const countQuery = db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(showcase);
  const countResult = finalWhere
    ? await countQuery.where(finalWhere).get()
    : await countQuery.get();
  const totalCount = countResult?.count ?? 0;

  if (totalCount === 0) {
    return {
      items: [],
      page: params.page,
      pageSize: params.pageSize,
      total: 0,
    };
  }

  // Fetch paginated sorted results with filter and sort applied at database level
  const startIndex = (params.page - 1) * params.pageSize;
  const baseRecordsQuery = db
    .select({
      id: showcase.id,
      name: showcase.name,
      description: showcase.description,
      url: showcase.url,
      image: showcase.image,
      authorId: showcase.authorId,
      upvotes: showcase.upvotes,
      downvotes: showcase.downvotes,
      score: showcase.score,
      publishedAt: showcase.publishedAt,
      createdAt: showcase.createdAt,
      updatedAt: showcase.updatedAt,
      deletedAt: showcase.deletedAt,
      userVote: params.authorId
        ? showcaseVote.value
        : sql<-1 | 1 | null>`NULL`.as("userVote"),
    })
    .from(showcase)
    .$dynamic();

  const queryWithJoin = params.authorId
    ? baseRecordsQuery.leftJoin(
        showcaseVote,
        and(
          eq(showcaseVote.showcaseId, showcase.id),
          eq(showcaseVote.userId, params.authorId),
        ),
      )
    : baseRecordsQuery;

  const filteredRecordsQuery = finalWhere
    ? queryWithJoin.where(finalWhere)
    : queryWithJoin;

  const paginatedShowcases = await filteredRecordsQuery
    .orderBy(orderBy)
    .limit(params.pageSize)
    .offset(startIndex)
    .all();

  if (paginatedShowcases.length === 0) {
    return {
      items: [],
      page: params.page,
      pageSize: params.pageSize,
      total: totalCount,
    };
  }

  const pageIds = paginatedShowcases.map((r) => r.id);

  // Fetch tags for paginated showcases
  const tagRows = await db
    .select({ showcaseId: showcaseTag.showcaseId, tagName: tag.name })
    .from(showcaseTag)
    .innerJoin(tag, eq(showcaseTag.tagId, tag.id))
    .where(inArray(showcaseTag.showcaseId, pageIds))
    .all();

  // Fetch author details for showcases with authors
  const authorIds = [
    ...new Set(
      paginatedShowcases
        .map((r) => r.authorId)
        .filter((id): id is string => !!id),
    ),
  ];

  const authorRows =
    authorIds.length > 0
      ? await db
          .select({ id: user.id, email: user.email, name: user.name })
          .from(user)
          .where(inArray(user.id, authorIds as string[]))
          .all()
      : [];

  const authorMap = new Map(authorRows.map((a) => [a.id, a]));

  // Build final showcase items with tags and author details
  const map = new Map<string, ShowcaseItem>();

  for (const row of paginatedShowcases) {
    const key = String(row.id);
    const author = row.authorId ? authorMap.get(row.authorId) : undefined;

    map.set(key, {
      id: row.id,
      name: row.name,
      description: row.description,
      url: row.url,
      image: row.image ?? undefined,
      tags: [],
      authorId: row.authorId ?? undefined,
      author: author
        ? {
            id: author.id,
            email: author.email,
            name: author.name,
          }
        : undefined,
      upvotes: row.upvotes ?? undefined,
      downvotes: row.downvotes ?? undefined,
      score: row.score ?? undefined,
      publishedAt: row.publishedAt ?? undefined,
      createdAt: row.createdAt ?? undefined,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
      userVote: row.userVote ?? undefined,
    });
  }

  // Attach tags to their respective showcases
  for (const tr of tagRows) {
    const key = String(tr.showcaseId);
    if (map.has(key)) {
      map.get(key)!.tags.push(tr.tagName);
    }
  }

  return {
    items: Array.from(map.values()),
    page: params.page,
    pageSize: params.pageSize,
    total: totalCount,
  };
}
