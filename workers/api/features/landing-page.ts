import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import * as schema from "~/database/schema/showcase";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { seedShowcases } from "~/features/landing-page/utils/seed-showcase";

const { showcase, showcaseTag } = schema;

const app = new Hono<{ Bindings: Env }>();

function getDbOrFail(c: Context): DrizzleD1Database<typeof schema> | Response {
  if (!c.env.DB) {
    return c.json({ success: false, error: "Database not available" }, 500);
  }
  return drizzle(c.env.DB) as DrizzleD1Database<typeof schema>;
}

app.get("/", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;

    const { title, description, githubRepository, commercialLink } =
      await getPageInformation({ ...c.env } as any);
    const showcases = await getShowcases(db);

    return c.json({
      title,
      description,
      githubRepository,
      commercialLink,
      showcases,
    });
  } catch (error) {
    console.error("Error get showcases:", error);
    return c.json({ success: false, error: "Unexpected server error" }, 500);
  }
});

const projectInfoSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  url: z.url(),
  image: z.url().optional(),
  tags: z.array(z.string().min(2).max(100)).optional(),
});

app.post("/showcase/seed", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;

    const body = await c.req.json();
    const parsed = z.array(projectInfoSchema).safeParse(body);
    if (!parsed.success) {
      return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
    }

    await seedShowcases(db, parsed.data as ProjectInfoWithoutID[]);
    return c.json({ success: true });
  } catch (error) {
    console.error("Error seeding showcases:", error);
    return c.json({ success: false, error: "Failed to seed showcases" }, 500);
  }
});

const showcaseBodySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  url: z.url(),
  image: z.string().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

app.put("/showcase/:id", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;

    const id = Number(c.req.param("id"));
    if (isNaN(id)) {
      return c.json({ error: "Invalid ID" }, 400);
    }

    const body = await c.req.json();
    const parsed = showcaseBodySchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten() }, 400);
    }

    const data = parsed.data;

    const existing = await db
      .select()
      .from(showcase)
      .where(eq(showcase.id, id));
    if (!existing.length) {
      return c.json({ error: "Showcase not found" }, 404);
    }

    await db
      .update(showcase)
      .set({
        name: data.name,
        description: data.description,
        url: data.url,
        image: data.image,
      })
      .where(eq(showcase.id, id));

    if (data.tags) {
      await db.delete(showcaseTag).where(eq(showcaseTag.showcaseId, id));

      if (data.tags.length > 0) {
        await db.insert(showcaseTag).values(
          data.tags.map((tag) => ({
            showcaseId: id,
            tag,
          })),
        );
      }
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Error updating showcase:", error);
    return c.json({ success: false, error: "Unexpected server error" }, 500);
  }
});

export default app;
