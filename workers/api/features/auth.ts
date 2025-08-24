import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";

import type { DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";

import * as schema from "~/database/schema";
import { MAX_USERS } from "~/features/auth/constants/limit";
import { createUser, getUserByEmail } from "~/user.server";

const { user } = schema;

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

/**
 * POST /auth/admin/register
 *
 * Registers a new admin user.
 *
 * Request body (JSON, validated with Zod):
 * - email: string (valid email)
 * - password: string (min 8 chars)
 * - name: string (min 2 chars)
 * - adminSecret: string (must match ADMIN_SECRET)
 *
 * Responses:
 * - 200: { success: true, admin: { id, email, name, role } }
 * - 403: { error: "Invalid admin secret" }
 * - 409: { error: "User already exists" }
 * - 400: { error: "Validation failed", details }
 * - 500: { error: "Admin registration failed" }
 *
 * Type safety: Uses Drizzle ORM and Zod for validation.
 * Security: Requires correct adminSecret for registration.
 */
app.post("/admin/register", async (c): Promise<Response> => {
  const db = getDbOrFail(c);
  if (db instanceof Response) return db;

  const userCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .get();

  if ((userCount?.count ?? 0) >= MAX_USERS) {
    return c.json({ error: "Registration limit reached" }, 403);
  }

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
    if (import.meta.env.DEV) {
      console.error("Admin registration error:", error);
    }

    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }

    return c.json({ error: "Admin registration failed" }, 500);
  }
});

/**
 * POST /auth/member/register
 *
 * Registers a new member user.
 *
 * Request body (JSON, validated with Zod):
 * - email: string (valid email)
 * - password: string (min 8 chars)
 * - name: string (min 2 chars)
 *
 * Responses:
 * - 200: { success: true, user: { id, email, name, role } }
 * - 409: { error: "User already exists" }
 * - 400: { error: "Validation failed", details }
 * - 500: { error: "Member registration failed" }
 *
 * Type safety: Uses Drizzle ORM and Zod for validation.
 * Security: Does not require admin secret.
 */
app.post("member/register", async (c) => {
  const db = getDbOrFail(c);
  if (db instanceof Response) return db;

  const userCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .get();

  if ((userCount?.count ?? 0) >= MAX_USERS) {
    return c.json({ error: "Registration limit reached" }, 403);
  }

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
      role: "user",
    });

    return c.json({
      success: true,
      user: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Member registration error:", error);
    }

    if (error instanceof z.ZodError) {
      return c.json({ error: "Validation failed", details: error.issues }, 400);
    }

    return c.json({ error: "Member registration failed" }, 500);
  }
});

export default app;
