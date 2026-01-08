import { zValidator } from "@hono/zod-validator";
import { endOfDay, isValid, parse, parseISO, startOfDay } from "date-fns";
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
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { ProjectInfoWithoutID } from "~/features/landing-page/types/type";

import * as schema from "~/database/schema";
import { seedShowcases } from "~/features/landing-page/utils/seed-showcase";

const seedShowcaseSchema = z.object({
  showcases: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.url(),
        image: z.url().optional(),
        tags: z.array(z.string().min(1)).default([]),
        authorId: z.string().optional(),
        publishedAt: z
          .union([z.number(), z.coerce.date()])
          .transform((val) => (typeof val === "number" ? new Date(val) : val))
          .optional(),
      }),
    )
    .min(1, "Provide at least one showcase to seed."),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["name", "createdAt", "publishedAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(1).optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val.trim()] : val))
    .optional(),
  authorId: z.string().min(1).optional(),
  authorName: z.string().min(1).optional(),
  publishedAfter: z
    .union([
      z.coerce.number().transform((val) => new Date(val)),
      z.coerce.date(),
      z.string().transform((val) => {
        // Try YYYY-MM-DD format first
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          const parsed = parse(val, "yyyy-MM-dd", new Date());
          if (!isValid(parsed)) throw new Error("Invalid date format");
          return startOfDay(parsed);
        }
        // Try ISO 8601 format
        const parsed = parseISO(val);
        if (!isValid(parsed)) throw new Error("Invalid ISO date format");
        return parsed;
      }),
    ])
    .optional(),
  publishedBefore: z
    .union([
      z.coerce.number().transform((val) => new Date(val)),
      z.coerce.date(),
      z.string().transform((val) => {
        // Try YYYY-MM-DD format first
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          const parsed = parse(val, "yyyy-MM-dd", new Date());
          if (!isValid(parsed)) throw new Error("Invalid date format");
          return endOfDay(parsed);
        }
        // Try ISO 8601 format
        const parsed = parseISO(val);
        if (!isValid(parsed)) throw new Error("Invalid ISO date format");
        return parsed;
      }),
    ])
    .optional(),
  deleted: z.enum(["true", "false"]).optional(),
});

const tagsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["tag", "count"]).default("tag"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
  deleted: z.enum(["true", "false"]).optional(),
});

type ShowcaseApiItem = {
  id: string;
  name: string;
  description: string;
  url: string;
  image?: string;
  tags: string[];
  authorId?: string;
  author?: { id: string; email: string; name: string };
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

/**
 * Dev-only API routes for seeding showcase content.
 */
const devShowcaseApi = new Hono<{ Bindings: Env }>();

devShowcaseApi.use("*", async (c, next) => {
  if (import.meta.env.MODE !== "development") {
    return c.json(
      { error: "Seed endpoint available only in development." },
      403,
    );
  }

  return next();
});

devShowcaseApi.post(
  "/seed",
  zValidator("json", seedShowcaseSchema),
  async (c) => {
    const { showcases } = c.req.valid("json");

    const db: DrizzleD1Database<typeof schema> = drizzle(c.env.DB, {
      schema,
    });

    try {
      await seedShowcases(db, showcases as ProjectInfoWithoutID[]);
      return c.json(
        { message: "Showcases seeded", count: showcases.length },
        201,
      );
    } catch (error) {
      console.error("Seed showcases failed", error);
      return c.json({ error: "Failed to seed showcases" }, 500);
    }
  },
);

devShowcaseApi.get("/list", zValidator("query", listQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const db: DrizzleD1Database<typeof schema> = drizzle(c.env.DB, {
    schema,
  });

  const { showcase, showcaseTag, user } = schema;

  const whereClauses = [] as ReturnType<typeof eq>[];

  if (query.search) {
    whereClauses.push(
      or(
        like(showcase.name, `%${query.search}%`),
        like(showcase.description, `%${query.search}%`),
      )!,
    );
  }

  if (query.authorId) {
    whereClauses.push(eq(showcase.authorId, query.authorId));
  }

  if (query.publishedAfter) {
    whereClauses.push(gte(showcase.publishedAt, query.publishedAfter));
  }

  if (query.publishedBefore) {
    whereClauses.push(lte(showcase.publishedAt, query.publishedBefore));
  }

  if (query.deleted === "true") {
    whereClauses.push(isNotNull(showcase.deletedAt));
  } else {
    whereClauses.push(isNull(showcase.deletedAt));
  }

  const allConditions: typeof whereClauses = [...whereClauses];

  if (query.tags && query.tags.length > 0) {
    const showcaseIdsWithTags = await db
      .select({ showcaseId: showcaseTag.showcaseId })
      .from(showcaseTag)
      .where(inArray(showcaseTag.tag, query.tags))
      .groupBy(showcaseTag.showcaseId)
      .all();

    const validIds = showcaseIdsWithTags.map((r) => r.showcaseId);
    if (validIds.length === 0) {
      return c.json(
        { items: [], page: query.page, pageSize: query.pageSize, total: 0 },
        200,
      );
    }
    allConditions.push(inArray(showcase.id, validIds));
  }

  if (query.authorName) {
    const authorsWithName = await db
      .select({ id: user.id })
      .from(user)
      .where(like(user.name, `%${query.authorName}%`))
      .all();

    const validAuthorIds = authorsWithName.map((a) => a.id);
    if (validAuthorIds.length === 0) {
      return c.json(
        { items: [], page: query.page, pageSize: query.pageSize, total: 0 },
        200,
      );
    }
    allConditions.push(inArray(showcase.authorId, validAuthorIds));
  }

  const finalWhere = allConditions.length
    ? allConditions.length === 1
      ? allConditions[0]
      : and(...allConditions)
    : undefined;

  const filteredIds = await db
    .select({ id: showcase.id })
    .from(showcase)
    .where(finalWhere)
    .all();
  const totalCount = filteredIds.length;

  if (totalCount === 0) {
    return c.json(
      { items: [], page: query.page, pageSize: query.pageSize, total: 0 },
      200,
    );
  }

  const startIndex = (query.page - 1) * query.pageSize;
  const paginatedIds = filteredIds
    .slice(startIndex, startIndex + query.pageSize)
    .map((r) => r.id);

  if (paginatedIds.length === 0) {
    return c.json(
      {
        items: [],
        page: query.page,
        pageSize: query.pageSize,
        total: totalCount,
      },
      200,
    );
  }

  const orderColumn =
    query.sortBy === "name"
      ? showcase.name
      : query.sortBy === "publishedAt"
        ? showcase.publishedAt
        : showcase.createdAt;
  const orderBy =
    query.sortDir === "asc" ? asc(orderColumn) : desc(orderColumn);

  const pageItems = await db
    .select({
      id: showcase.id,
      name: showcase.name,
      description: showcase.description,
      url: showcase.url,
      image: showcase.image,
      authorId: showcase.authorId,
      publishedAt: showcase.publishedAt,
      createdAt: showcase.createdAt,
      updatedAt: showcase.updatedAt,
      deletedAt: showcase.deletedAt,
    })
    .from(showcase)
    .where(inArray(showcase.id, paginatedIds))
    .orderBy(orderBy)
    .all();

  const pageIds = pageItems.map((r) => r.id);

  const tagRows = await db
    .select({ showcaseId: showcaseTag.showcaseId, tag: showcaseTag.tag })
    .from(showcaseTag)
    .where(inArray(showcaseTag.showcaseId, pageIds))
    .all();

  const authorIds = [
    ...new Set(
      pageItems.map((r) => r.authorId).filter((id): id is string => !!id),
    ),
  ];

  const authorRows =
    authorIds.length > 0
      ? await db
          .select({ id: user.id, email: user.email, name: user.name })
          .from(user)
          .where(inArray(user.id, authorIds))
          .all()
      : [];

  const authorMap = new Map(authorRows.map((a) => [a.id, a]));

  const map = new Map<string, ShowcaseApiItem>();

  for (const row of pageItems) {
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
      publishedAt: row.publishedAt ?? undefined,
      createdAt: row.createdAt ?? undefined,
      updatedAt: row.updatedAt ?? undefined,
      deletedAt: row.deletedAt ?? undefined,
    });
  }

  for (const tr of tagRows) {
    const key = String(tr.showcaseId);
    if (map.has(key)) {
      map.get(key)!.tags.push(tr.tag);
    }
  }

  return c.json(
    {
      items: Array.from(map.values()),
      page: query.page,
      pageSize: query.pageSize,
      total: totalCount,
    },
    200,
  );
});

devShowcaseApi.get("/tags", zValidator("query", tagsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const db: DrizzleD1Database<typeof schema> = drizzle(c.env.DB, {
    schema,
  });

  const { showcase, showcaseTag } = schema;

  const deletedFilter =
    query.deleted === "true"
      ? isNotNull(showcase.deletedAt)
      : isNull(showcase.deletedAt);

  const countColumn = sql<number>`count(distinct ${showcase.id})`;

  const orderBy =
    query.sortBy === "tag"
      ? query.sortDir === "asc"
        ? asc(showcaseTag.tag)
        : desc(showcaseTag.tag)
      : query.sortDir === "asc"
        ? asc(countColumn)
        : desc(countColumn);

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

  const startIndex = (query.page - 1) * query.pageSize;
  const endIndex = startIndex + query.pageSize;
  const paginatedTags = tagsWithCount.slice(startIndex, endIndex);

  return c.json(
    {
      items: paginatedTags,
      page: query.page,
      pageSize: query.pageSize,
      total,
    },
    200,
  );
});

export default devShowcaseApi;
