import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";

import type { ProjectInfoWithoutID } from "~/features/landing-page/types/type";

import * as showcaseSchema from "~/database/schema/showcase";
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
  "/seed-showcases",
  zValidator("json", seedShowcaseSchema),
  async (c) => {
    const { showcases } = c.req.valid("json");

    const db: DrizzleD1Database<typeof showcaseSchema> = drizzle(c.env.DB, {
      schema: showcaseSchema,
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

export default devShowcaseApi;
