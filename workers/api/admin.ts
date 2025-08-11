import { Hono } from "hono";
import { z } from "zod";

import * as schema from "~/database/schema";
import { logSecurityAccess } from "~/lib/auth/route-security.server";
import { createUser, getUserByEmail } from "~/user.server";
import { getDb } from "~/workers/api/helpers";

type Bindings = {
  DB: D1Database;
};

const admin = new Hono<{ Bindings: Bindings }>();

const adminRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  adminSecret: z.string(),
});

const ADMIN_SECRET =
  process.env.ADMIN_REGISTRATION_SECRET || "nara-admin-secret-2024";

// POST /api/admin/register
admin.post("/register", async (c): Promise<Response> => {
  const db = getDb(c.env.DB, schema);

  if (c.req.method !== "POST") {
    return c.json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await c.req.json();
    const validatedData = adminRegisterSchema.parse(body);

    // Verify admin secret
    if (validatedData.adminSecret !== ADMIN_SECRET) {
      await logSecurityAccess(
        db,
        null,
        c.req.raw,
        "/api/admin/register",
        "critical",
        {
          action: "admin_register_failed",
          reason: "invalid_secret",
        },
      );
      return c.json({ error: "Invalid admin secret" }, 403);
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(db, validatedData.email);
    if (existingUser) {
      return c.json({ error: "User already exists" }, 409);
    }

    // Create admin user
    const newAdmin = await createUser(
      db,
      {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        role: "admin",
        createdBy: null,
      },
      {
        sendVerificationEmail: true,
        baseUrl: new URL(c.req.url).origin,
      },
    );

    await logSecurityAccess(
      db,
      newAdmin.id,
      c.req.raw,
      "/api/admin/register",
      "critical",
      {
        action: "admin_registered",
        adminId: newAdmin.id,
      },
    );

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

export default admin;
