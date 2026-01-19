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

import type { Showcase, Tag } from "~/database/contracts";

import type {
  AuthorRow,
  FetchShowcasesParams,
  ShowcaseRow,
  TagRow,
} from "./list-showcase.model";

import * as schema from "~/database/schema";

/**
 * Gets total count of showcases matching filter conditions.
 * Pure data access - no business logic.
 */
export const getShowcasesCount = async (
  db: DrizzleD1Database<typeof schema>,
  finalWhere?: SQL<unknown>,
): Promise<number> => {
  const { showcase } = schema;
  const countQuery = db
    .select({ count: sql<number>`cast(count(*) as integer)` })
    .from(showcase);
  const countResult = finalWhere
    ? await countQuery.where(finalWhere).get()
    : await countQuery.get();
  return countResult?.count ?? 0;
};

/**
 * Gets showcase IDs matching the given tags.
 * Pure data access - no business logic.
 */
export const getShowcaseIdsByTags = async (
  db: DrizzleD1Database<typeof schema>,
  tagNames: string[],
): Promise<string[]> => {
  const { showcaseTag, tag } = schema;
  const result = await db
    .select({ showcaseId: showcaseTag.showcaseId })
    .from(showcaseTag)
    .innerJoin(tag, eq(showcaseTag.tagId, tag.id))
    .where(inArray(tag.name, tagNames))
    .groupBy(showcaseTag.showcaseId)
    .all();
  return result.map((r) => r.showcaseId);
};

/**
 * Gets user IDs matching the given author name.
 * Pure data access - no business logic.
 */
export const getUserIdsByName = async (
  db: DrizzleD1Database<typeof schema>,
  authorName: string,
): Promise<string[]> => {
  const { user } = schema;
  const result = await db
    .select({ id: user.id })
    .from(user)
    .where(like(user.name, `%${authorName}%`))
    .all();
  return result.map((a) => a.id);
};

/**
 * Fetches paginated showcase rows with optional filter and sort.
 * Pure data access - no business logic.
 */
export const getShowcaseRows = async (
  db: DrizzleD1Database<typeof schema>,
  params: FetchShowcasesParams,
  finalWhere?: SQL<unknown>,
): Promise<ShowcaseRow[]> => {
  const { showcase, showcaseVote } = schema;

  const orderColumn =
    params.sortBy === "name"
      ? showcase.name
      : params.sortBy === "publishedAt"
        ? showcase.publishedAt
        : showcase.createdAt;
  const orderBy =
    params.sortDir === "asc" ? asc(orderColumn) : desc(orderColumn);

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
      userVote: params.viewerId
        ? showcaseVote.value
        : sql<-1 | 1 | null>`NULL`.as("userVote"),
    })
    .from(showcase)
    .$dynamic();

  const queryWithJoin = params.viewerId
    ? baseRecordsQuery.leftJoin(
        showcaseVote,
        and(
          eq(showcaseVote.showcaseId, showcase.id),
          eq(showcaseVote.userId, params.viewerId),
        ),
      )
    : baseRecordsQuery;

  const filteredRecordsQuery = finalWhere
    ? queryWithJoin.where(finalWhere)
    : queryWithJoin;

  return await filteredRecordsQuery
    .orderBy(orderBy)
    .limit(params.pageSize)
    .offset(startIndex)
    .all();
};

/**
 * Gets tags for the given showcase IDs.
 * Pure data access - no business logic.
 */
export const getTagsForShowcases = async (
  db: DrizzleD1Database<typeof schema>,
  showcaseIds: string[],
): Promise<TagRow[]> => {
  const { showcaseTag, tag } = schema;
  return await db
    .select({ showcaseId: showcaseTag.showcaseId, tagName: tag.name })
    .from(showcaseTag)
    .innerJoin(tag, eq(showcaseTag.tagId, tag.id))
    .where(inArray(showcaseTag.showcaseId, showcaseIds))
    .all();
};

/**
 * Gets author details by IDs.
 * Pure data access - no business logic.
 */
export const getAuthorsByIds = async (
  db: DrizzleD1Database<typeof schema>,
  authorIds: string[],
): Promise<AuthorRow[]> => {
  const { user } = schema;
  return await db
    .select({ id: user.id, email: user.email, name: user.name })
    .from(user)
    .where(inArray(user.id, authorIds))
    .all();
};

/**
 * Builds where clauses from filter parameters.
 * Pure filter logic - no data access.
 */
export const buildFilterClauses = (params: FetchShowcasesParams): SQL[] => {
  const { showcase } = schema;
  const clauses: SQL[] = [];

  if (params.search) {
    clauses.push(
      or(
        like(showcase.name, `%${params.search}%`),
        like(showcase.description, `%${params.search}%`),
      )!,
    );
  }

  if (params.authorId) {
    clauses.push(eq(showcase.authorId, params.authorId));
  }

  if (params.publishedAfter) {
    clauses.push(gte(showcase.publishedAt, params.publishedAfter));
  }

  if (params.publishedBefore) {
    clauses.push(lte(showcase.publishedAt, params.publishedBefore));
  }

  if (params.deleted === "true") {
    clauses.push(isNotNull(showcase.deletedAt));
  } else {
    clauses.push(isNull(showcase.deletedAt));
  }

  if (params.published === "true") {
    clauses.push(isNotNull(showcase.publishedAt));
  } else if (params.published === "false") {
    clauses.push(isNull(showcase.publishedAt));
  }

  if (params.minScore !== undefined) {
    clauses.push(gte(showcase.score, params.minScore));
  }

  return clauses;
};
