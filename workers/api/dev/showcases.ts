import { zValidator } from "@hono/zod-validator";
import {
  and,
  asc,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
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
      }),
    )
    .min(1, "Provide at least one showcase to seed."),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["name", "createdAt", "publishedAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  authorId: z.string().min(1).optional(),
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

  if (query.authorId) {
    whereClauses.push(eq(showcase.authorId, query.authorId));
  }

  if (query.deleted === "true") {
    whereClauses.push(isNotNull(showcase.deletedAt));
  } else {
    whereClauses.push(isNull(showcase.deletedAt));
  }

  const where = whereClauses.length
    ? whereClauses.length === 1
      ? whereClauses[0]
      : and(...whereClauses)
    : undefined;

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
    .where(where)
    .orderBy(orderBy)
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize)
    .all();

  const pageIds = pageItems.map((r) => r.id);

  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(showcase)
    .where(where)
    .get();

  if (pageIds.length === 0) {
    return c.json(
      {
        items: [],
        page: query.page,
        pageSize: query.pageSize,
        total: totalRow?.count ?? 0,
      },
      200,
    );
  }

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
      total: totalRow?.count ?? 0,
    },
    200,
  );
});

export default devShowcaseApi;
