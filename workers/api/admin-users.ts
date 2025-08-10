import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";
import type { Context } from "hono";

import * as schema from "~/database/schema";
import { verifyAPIToken } from "~/lib/auth/api-tokens.server";
import { getUsersCreatedBy, updateUserByAdmin, deleteUserByAdmin, createUser } from "~/user.server";

/**
 * Admin User Management API
 * Provides CRUD operations for admin users to manage their created users
 */

type Bindings = {
  DB: D1Database;
};

type AdminContext = {
  Bindings: Bindings;
  Variables: {
    adminId: number;
    db: ReturnType<typeof drizzle<typeof schema>>;
  };
};

const adminUsers = new Hono<AdminContext>();

// Schemas for validation
const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const updateUserSchema = z.object({
  userId: z.number(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

const deleteUserSchema = z.object({
  userId: z.number(),
});

// Middleware to verify admin access
const verifyAdminAccess = async (c: Context<AdminContext>, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ 
      error: "Authorization token required",
      code: "AUTH_REQUIRED"
    }, 401);
  }

  const token = authHeader.substring(7);
  const db = drizzle(c.env.DB, { schema });

  // Verify API token
  const tokenData = await verifyAPIToken(db, token);
  if (!tokenData) {
    return c.json({ 
      error: "Invalid or expired token",
      code: "INVALID_TOKEN"
    }, 401);
  }

  // Check if user is admin
  if (tokenData.user.role !== "admin") {
    return c.json({ 
      error: "Admin access required",
      code: "ADMIN_REQUIRED"
    }, 403);
  }

  // Store admin info for use in routes
  c.set("adminId", tokenData.user.id);
  c.set("db", db);
  
  await next();
};

/**
 * List users created by the admin
 * GET /api/admin/users
 */
adminUsers.get("/", verifyAdminAccess, async (c) => {
  try {
    const adminId = c.get("adminId");
    const db = c.get("db");

    const managedUsers = await getUsersCreatedBy(db, adminId);

    return c.json({
      users: managedUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (error) {
    console.error("List users error:", error);
    return c.json({ 
      error: "Failed to list users",
      code: "LIST_FAILED"
    }, 500);
  }
});

/**
 * Create new user
 * POST /api/admin/users
 */
adminUsers.post("/", verifyAdminAccess, async (c) => {
  try {
    const adminId = c.get("adminId");
    const db = c.get("db");
    const body = await c.req.json();
    
    const validatedData = createUserSchema.parse(body);

    const newUser = await createUser(db, {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: "user",
      createdBy: adminId,
    }, {
      sendVerificationEmail: true,
      baseUrl: new URL(c.req.url).origin,
    });

    return c.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        emailVerified: newUser.emailVerified,
        createdAt: newUser.createdAt,
      },
    }, 201);
  } catch (error) {
    console.error("Create user error:", error);
    
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: "Validation failed", 
        details: error.issues,
        code: "VALIDATION_ERROR"
      }, 400);
    }

    return c.json({ 
      error: "Failed to create user",
      code: "CREATE_FAILED"
    }, 500);
  }
});

/**
 * Update user
 * PUT /api/admin/users/:id
 */
adminUsers.put("/:id", verifyAdminAccess, async (c) => {
  try {
    const adminId = c.get("adminId");
    const db = c.get("db");
    const userId = parseInt(c.req.param("id"));
    const body = await c.req.json();
    
    if (!userId) {
      return c.json({ 
        error: "Invalid user ID",
        code: "INVALID_ID"
      }, 400);
    }

    const validatedData = updateUserSchema.parse({ ...body, userId });

    const result = await updateUserByAdmin(
      db,
      adminId,
      userId,
      {
        name: validatedData.name,
        email: validatedData.email,
        role: validatedData.role,
      }
    );

    if (!result.success) {
      return c.json({ 
        error: result.error,
        code: "UPDATE_FAILED"
      }, 400);
    }

    return c.json({
      success: true,
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
        role: result.user?.role,
        emailVerified: result.user?.emailVerified,
        updatedAt: result.user?.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update user error:", error);
    
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: "Validation failed", 
        details: error.issues,
        code: "VALIDATION_ERROR"
      }, 400);
    }

    return c.json({ 
      error: "Failed to update user",
      code: "UPDATE_FAILED"
    }, 500);
  }
});

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
adminUsers.delete("/:id", verifyAdminAccess, async (c) => {
  try {
    const adminId = c.get("adminId");
    const db = c.get("db");
    const userId = parseInt(c.req.param("id"));
    
    if (!userId) {
      return c.json({ 
        error: "Invalid user ID",
        code: "INVALID_ID"
      }, 400);
    }

    const result = await deleteUserByAdmin(db, adminId, userId);

    if (!result.success) {
      return c.json({ 
        error: result.error,
        code: "DELETE_FAILED"
      }, 400);
    }

    return c.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return c.json({ 
      error: "Failed to delete user",
      code: "DELETE_FAILED"
    }, 500);
  }
});

export default adminUsers;