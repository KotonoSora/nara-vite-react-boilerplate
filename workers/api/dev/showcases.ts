import { zValidator } from "@hono/zod-validator";
import { endOfDay, isValid, parse, parseISO, startOfDay } from "date-fns";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { ProjectInfoWithoutID } from "~/features/landing-page/types/type";

import * as schema from "~/database/schema";
import { fetchShowcaseTags } from "~/features/landing-page/utils/fetch-showcase-tags";
import { fetchShowcases } from "~/features/landing-page/utils/fetch-showcases";
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

  try {
    const result = await fetchShowcases(db, query);
    return c.json(result, 200);
  } catch (error) {
    console.error("Fetch showcases failed", error);
    return c.json({ error: "Failed to fetch showcases" }, 500);
  }
});

devShowcaseApi.get("/tags", zValidator("query", tagsQuerySchema), async (c) => {
  const query = c.req.valid("query");
  const db: DrizzleD1Database<typeof schema> = drizzle(c.env.DB, {
    schema,
  });

  try {
    const result = await fetchShowcaseTags(db, query);
    return c.json(result, 200);
  } catch (error) {
    console.error("Fetch showcase tags failed", error);
    return c.json({ error: "Failed to fetch showcase tags" }, 500);
  }
});

export default devShowcaseApi;
