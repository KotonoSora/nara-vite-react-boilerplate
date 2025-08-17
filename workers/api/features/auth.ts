import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import * as schema from "~/database/schema";
import { createUser, getUserByEmail } from "~/user.server";

const app = new Hono<{ Bindings: Env }>();

function getDbOrFail(c: Context): DrizzleD1Database<typeof schema> | Response {
  if (!c.env.DB) {
    return c.json({ success: false, error: "Database not available" }, 500);
  }
  return drizzle(c.env.DB) as DrizzleD1Database<typeof schema>;
}

const adminRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
  adminSecret: z.string(),
});

const ADMIN_SECRET =
  process.env.ADMIN_REGISTRATION_SECRET || "nara-admin-secret-2025-08";

// POST /api/auth/admin/register
app.post("/admin/register", async (c): Promise<Response> => {
  const db = getDbOrFail(c);
  if (db instanceof Response) return db;

  try {
    const body = await c.req.json();
    const validatedData = adminRegisterSchema.parse(body);

    // Verify admin secret
    if (validatedData.adminSecret !== ADMIN_SECRET) {
      return c.json({ error: "Invalid admin secret" }, 403);
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(db, validatedData.email);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // Create admin user
    const newAdmin = await createUser(db, {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: "admin",
    });

    return c.json({
      success: true,
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);

    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }

    return c.json({ error: "Admin registration failed" }, 500);
  }
});

export default app;
