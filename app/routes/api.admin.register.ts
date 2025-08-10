import type { Route } from "./+types/api.admin.register";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";

import * as schema from "~/database/schema";
import { createUser, getUserByEmail } from "~/user.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";

const adminRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  adminSecret: z.string(),
});

const ADMIN_SECRET = process.env.ADMIN_REGISTRATION_SECRET || "nara-admin-secret-2024";

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const validatedData = adminRegisterSchema.parse(body);

    // Verify admin secret
    if (validatedData.adminSecret !== ADMIN_SECRET) {
      await logSecurityAccess(db, null, request, "/api/admin/register", "critical", {
        action: "admin_register_failed",
        reason: "invalid_secret",
      });
      return Response.json({ error: "Invalid admin secret" }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(db, validatedData.email);
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 409 });
    }

    // Create admin user
    const newAdmin = await createUser(db, {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: "admin",
      // Admin accounts created via secret registration have no creator
      createdBy: null,
    }, {
      sendVerificationEmail: true,
      baseUrl: new URL(request.url).origin,
    });

    // Log successful admin registration
    await logSecurityAccess(db, newAdmin.id, request, "/api/admin/register", "critical", {
      action: "admin_registered",
      adminId: newAdmin.id,
    });

    return Response.json({
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
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Admin registration failed" },
      { status: 500 }
    );
  }
}