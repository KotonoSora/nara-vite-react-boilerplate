import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import { evaluateFeatureFlags, seedDefaultUserGroups } from "~/features/feature-flags/utils";
import * as schema from "~/database/schema";

const featureFlagsRoute = new Hono<{ Bindings: Env }>();

function getDbOrFail(c: Context): DrizzleD1Database<typeof schema> | Response {
  if (!c.env.DB) {
    return c.json({ success: false, error: "Database not available" }, 500);
  }
  return drizzle(c.env.DB, { schema }) as DrizzleD1Database<typeof schema>;
}

/**
 * GET /api/feature-flags
 * Returns all feature flags evaluated for the current context
 * 
 * Query parameters:
 * - userId: Optional user ID for evaluation
 * - userGroups: Comma-separated list of user groups
 * - isAdmin: Boolean indicating admin status
 */
featureFlagsRoute.get("/", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;
    
    // Extract context from query parameters (in a real app, this would come from auth)
    const userId = c.req.query("userId");
    const userGroupsParam = c.req.query("userGroups");
    const isAdmin = c.req.query("isAdmin") === "true";
    
    const userGroups = userGroupsParam ? userGroupsParam.split(",") : [];
    
    const context = {
      userId,
      userGroups,
      isAdmin,
    };

    const flags = await evaluateFeatureFlags(db, context);

    return c.json({
      success: true,
      data: {
        flags,
        context,
      },
    });
  } catch (error) {
    console.error("Error evaluating feature flags:", error);
    return c.json(
      {
        success: false,
        error: "Failed to evaluate feature flags",
      },
      500
    );
  }
});

/**
 * GET /api/feature-flags/all
 * Returns all feature flags (admin only)
 */
featureFlagsRoute.get("/all", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;
    
    // In a real app, check admin authorization here
    const isAdmin = c.req.query("isAdmin") === "true";
    if (!isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    const flags = await db.select().from(schema.featureFlags);
    
    return c.json({
      success: true,
      data: flags,
    });
  } catch (error) {
    console.error("Error fetching all feature flags:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch feature flags",
      },
      500
    );
  }
});

/**
 * POST /api/feature-flags
 * Creates a new feature flag (admin only)
 */
featureFlagsRoute.post("/", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;
    
    // In a real app, check admin authorization here
    const isAdmin = c.req.query("isAdmin") === "true";
    if (!isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    const body = await c.req.json();
    const { name, description, enabled = false, rolloutPercentage = 0 } = body;

    if (!name || !description) {
      return c.json(
        {
          success: false,
          error: "Name and description are required",
        },
        400
      );
    }

    const result = await db.insert(schema.featureFlags).values({
      name,
      description,
      enabled,
      rolloutPercentage,
    }).returning();

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error creating feature flag:", error);
    return c.json(
      {
        success: false,
        error: "Failed to create feature flag",
      },
      500
    );
  }
});

/**
 * PUT /api/feature-flags/:id
 * Updates an existing feature flag (admin only)
 */
featureFlagsRoute.put("/:id", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;
    
    // In a real app, check admin authorization here
    const isAdmin = c.req.query("isAdmin") === "true";
    if (!isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const { name, description, enabled, rolloutPercentage } = body;

    const updateData: any = {
      updatedAt: Date.now(),
    };

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (enabled !== undefined) updateData.enabled = enabled;
    if (rolloutPercentage !== undefined) updateData.rolloutPercentage = rolloutPercentage;

    const result = await db
      .update(schema.featureFlags)
      .set(updateData)
      .where(eq(schema.featureFlags.id, id))
      .returning();

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          error: "Feature flag not found",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error updating feature flag:", error);
    return c.json(
      {
        success: false,
        error: "Failed to update feature flag",
      },
      500
    );
  }
});

/**
 * POST /api/feature-flags/seed
 * Seeds default user groups (admin only, for setup)
 */
featureFlagsRoute.post("/seed", async (c) => {
  try {
    const db = getDbOrFail(c);
    if (db instanceof Response) return db;
    
    // In a real app, check admin authorization here
    const isAdmin = c.req.query("isAdmin") === "true";
    if (!isAdmin) {
      return c.json({ success: false, error: "Unauthorized" }, 403);
    }

    await seedDefaultUserGroups(db);

    return c.json({
      success: true,
      message: "Default user groups seeded successfully",
    });
  } catch (error) {
    console.error("Error seeding user groups:", error);
    return c.json(
      {
        success: false,
        error: "Failed to seed user groups",
      },
      500
    );
  }
});

export default featureFlagsRoute;