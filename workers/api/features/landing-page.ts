import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";

import type { ProjectInfoWithoutID } from "~/features/landing-page/types/type";
import type {
  APIErrorResponse,
  APISuccessResponse,
  HonoBindings,
} from "~/workers/types";

import * as schema from "~/database/schema/showcase";
import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { seedShowcases } from "~/features/landing-page/utils/seed-showcase";
import { getDbOrFail } from "~/workers/api/utils/db";
import { getValidated, zValidator } from "~/workers/api/utils/validation";
import { HTTP_STATUS } from "~/workers/types";

const { showcase, showcaseTag } = schema;

const app = new Hono<HonoBindings>();

app.get("/", async (c): Promise<Response> => {
  try {
    const db = getDbOrFail<typeof schema>(c, schema);
    if (db instanceof Response) return db;

    const { title, description, githubRepository, commercialLink } =
      getPageInformation({ ...c.env } as any);
    const showcases = await getShowcases(db);

    const successResponse: APISuccessResponse = {
      success: true,
      data: {
        title,
        description,
        githubRepository,
        commercialLink,
        showcases,
      },
    };

    return c.json(successResponse, HTTP_STATUS.OK);
  } catch (error) {
    console.error("Error get showcases:", error);
    const errorResponse: APIErrorResponse = {
      success: false,
      error: "Failed to fetch landing page data",
      details: import.meta.env.DEV
        ? error instanceof Error
          ? error.message
          : String(error)
        : undefined,
    };
    return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});

const projectInfoSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10).max(500),
  url: z.url(),
  image: z.url().optional(),
  tags: z.array(z.string().min(2).max(100)).optional(),
});

const seedSchema = z.object({
  seeds: z.array(projectInfoSchema),
});

app.post(
  "/showcase/seed",
  zValidator("json", seedSchema),
  async (c): Promise<Response> => {
    try {
      const db = getDbOrFail<typeof schema>(c, schema);
      if (db instanceof Response) return db;

      const { seeds } = getValidated<{ seeds: ProjectInfoWithoutID[] }>(
        c,
        "json",
      );

      await seedShowcases(db, seeds);

      const successResponse: APISuccessResponse = {
        success: true,
        message: `Successfully seeded ${seeds.length} showcases`,
      };

      return c.json(successResponse, HTTP_STATUS.CREATED);
    } catch (error) {
      console.error("Error seeding showcases:", error);
      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Failed to seed showcases",
        details: import.meta.env.DEV
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
      };
      return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },
);

const showcaseBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.url("Invalid URL format"),
  image: z.string().url("Invalid image URL").optional(),
  tags: z.array(z.string().trim().min(1, "Tag cannot be empty")).optional(),
});

const showcaseParamsSchema = z.object({
  id: z.coerce.number().int().positive("Invalid showcase ID"),
});

app.put(
  "/showcase/:id",
  zValidator("json", showcaseBodySchema),
  zValidator("param", showcaseParamsSchema),
  async (c): Promise<Response> => {
    try {
      const db = getDbOrFail<typeof schema>(c, schema);
      if (db instanceof Response) return db;

      const { id } = getValidated<{ id: number }>(c, "param");
      const data = getValidated<{
        name: string;
        description: string;
        url: string;
        image?: string;
        tags?: string[];
      }>(c, "json");

      // Check if showcase exists
      const existing = await db
        .select()
        .from(showcase)
        .where(eq(showcase.id, id))
        .get();

      if (!existing) {
        const errorResponse: APIErrorResponse = {
          success: false,
          error: "Showcase not found",
        };
        return c.json(errorResponse, HTTP_STATUS.NOT_FOUND);
      }

      // Update showcase
      await db
        .update(showcase)
        .set({
          name: data.name,
          description: data.description,
          url: data.url,
          image: data.image,
        })
        .where(eq(showcase.id, id));

      // Update tags if provided
      if (data.tags !== undefined) {
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

      const successResponse: APISuccessResponse = {
        success: true,
        message: "Showcase updated successfully",
      };

      return c.json(successResponse, HTTP_STATUS.OK);
    } catch (error) {
      console.error("Error updating showcase:", error);
      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Failed to update showcase",
        details: import.meta.env.DEV
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
      };
      return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },
);

export default app;
