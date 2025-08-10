import { Hono } from "hono";
import { z } from "zod";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "~/database/schema";
import { authenticateUser, createUser, getUserByEmail } from "~/user.server";
import { createAPIToken, verifyAPIToken } from "~/lib/auth/api-tokens.server";
import { createRateLimiters } from "~/lib/auth/rate-limit.server";
import { hashPassword } from "~/lib/auth/config";

/**
 * Public API Authentication endpoints
 * Provides JWT token-based authentication for external integrations
 */

type Bindings = {
  DB: D1Database;
};

const auth = new Hono<{ Bindings: Bindings }>();

// Login schema for API authentication
const apiLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  scopes: z.array(z.string()).optional().default(["profile:read"]),
  expiresInDays: z.number().min(1).max(365).optional().default(30),
  tokenName: z.string().min(3).optional().default("API Access"),
});

// Register schema for API user creation
const apiRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  scopes: z.array(z.string()).optional().default(["profile:read"]),
});

// Token verification schema
const tokenVerifySchema = z.object({
  token: z.string(),
});

/**
 * API Login endpoint - Returns JWT token
 * POST /api/auth/login
 */
auth.post("/login", async (c): Promise<Response> => {
  const body = await c.req.json();
  
  const result = apiLoginSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: "Invalid request data", details: result.error }, 400);
  }
  
  const { email, password, scopes, expiresInDays, tokenName } = result.data;
  const db = drizzle(c.env.DB, { schema });

  // Rate limiting
  const rateLimiters = createRateLimiters(db);
  
  try {
    await rateLimiters.login(c.req.raw, "/api/auth/login");
  } catch (rateLimitResponse) {
    return rateLimitResponse as Response;
  }

  try {
    // Get client metadata
    const clientIP = c.req.header("CF-Connecting-IP") || 
                    c.req.header("X-Forwarded-For") || 
                    "unknown";
    const userAgent = c.req.header("User-Agent") || "API Client";

    // Authenticate user
    const user = await authenticateUser(db, email, password, {
      ipAddress: clientIP,
      userAgent,
    });

    if (!user) {
      return c.json(
        { 
          error: "Invalid credentials",
          code: "INVALID_CREDENTIALS" 
        }, 
        401
      );
    }

    // Create API token
    const tokenInfo = await createAPIToken(db, user.id, {
      name: tokenName,
      scopes,
      expiresInDays,
    });

    return c.json({
      success: true,
      token: tokenInfo.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expiresAt: tokenInfo.expiresAt,
      scopes: tokenInfo.scopes,
    });

  } catch (error) {
    console.error("API login error:", error);
    return c.json(
      { 
        error: "Authentication failed",
        code: "AUTH_ERROR"
      }, 
      500
    );
  }
});

/**
 * API Register endpoint - Creates user and returns JWT token
 * POST /api/auth/register
 */
auth.post("/register", async (c): Promise<Response> => {
  const body = await c.req.json();
  
  const result = apiRegisterSchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: "Invalid request data", details: result.error }, 400);
  }
  
  const { email, password, name, scopes } = result.data;
  const db = drizzle(c.env.DB, { schema });

  // Rate limiting for registration
  const rateLimiters = createRateLimiters(db);
  
  try {
    await rateLimiters.register(c.req.raw, "/api/auth/register");
  } catch (rateLimitResponse) {
    return rateLimitResponse as Response;
  }

  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(db, email);
    if (existingUser) {
      return c.json(
        { 
          error: "User already exists",
          code: "USER_EXISTS"
        }, 
        409
      );
    }

    // Create new user
    const user = await createUser(db, {
      email,
      password,
      name,
      role: "user",
    });

    // Create API token for the new user
    const tokenInfo = await createAPIToken(db, user.id, {
      name: "Registration Token",
      scopes,
      expiresInDays: 30,
    });

    return c.json({
      success: true,
      message: "User created successfully",
      token: tokenInfo.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      expiresAt: tokenInfo.expiresAt,
      scopes: tokenInfo.scopes,
    }, 201);

  } catch (error) {
    console.error("API registration error:", error);
    return c.json(
      { 
        error: "Registration failed",
        code: "REGISTRATION_ERROR"
      }, 
      500
    );
  }
});

/**
 * Token verification endpoint
 * POST /api/auth/verify
 */
auth.post("/verify", async (c): Promise<Response> => {
  const body = await c.req.json();
  
  const result = tokenVerifySchema.safeParse(body);
  if (!result.success) {
    return c.json({ error: "Invalid request data", details: result.error }, 400);
  }
  
  const { token } = result.data;
  const db = drizzle(c.env.DB, { schema });

  try {
    const result = await verifyAPIToken(db, token);
    if (!result) {
      return c.json(
        { 
          valid: false,
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        }, 
        401
      );
    }

    const { user, tokenId, scopes } = result;

    return c.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokenId,
      scopes,
    });

  } catch (error) {
    return c.json(
      { 
        valid: false,
        error: "Invalid or expired token",
        code: "INVALID_TOKEN"
      }, 
      401
    );
  }
});

/**
 * Get current user info (requires authentication)
 * GET /api/auth/me
 */
auth.get("/me", async (c): Promise<Response> => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { 
        error: "Bearer token required",
        code: "MISSING_TOKEN"
      }, 
      401
    );
  }

  const token = authHeader.slice(7);
  const db = drizzle(c.env.DB, { schema });

  try {
    const result = await verifyAPIToken(db, token);
    if (!result) {
      return c.json(
        { 
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        }, 
        401
      );
    }

    const { user, scopes } = result;

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
      scopes,
    });

  } catch (error) {
    return c.json(
      { 
        error: "Invalid or expired token",
        code: "INVALID_TOKEN"
      }, 
      401
    );
  }
});

/**
 * Refresh token endpoint (creates new token)
 * POST /api/auth/refresh
 */
auth.post("/refresh", async (c): Promise<Response> => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json(
      { 
        error: "Bearer token required",
        code: "MISSING_TOKEN"
      }, 
      401
    );
  }

  const token = authHeader.slice(7);
  const db = drizzle(c.env.DB, { schema });

  try {
    const result = await verifyAPIToken(db, token);
    if (!result) {
      return c.json(
        { 
          error: "Invalid or expired token",
          code: "INVALID_TOKEN"
        }, 
        401
      );
    }

    const { user, scopes } = result;

    // Create new token with same scopes
    const newTokenInfo = await createAPIToken(db, user.id, {
      name: "Refreshed API Token",
      scopes,
      expiresInDays: 30,
    });

    return c.json({
      success: true,
      token: newTokenInfo.token,
      expiresAt: newTokenInfo.expiresAt,
      scopes: newTokenInfo.scopes,
    });

  } catch (error) {
    return c.json(
      { 
        error: "Invalid or expired token",
        code: "INVALID_TOKEN"
      }, 
      401
    );
  }
});

/**
 * Health check endpoint
 * GET /api/auth/health
 */
auth.get("/health", (c) => {
  return c.json({
    status: "ok",
    service: "authentication",
    timestamp: new Date().toISOString(),
  });
});

/**
 * Admin Registration endpoint - Creates admin account with secret
 * POST /api/auth/admin/register
 */
auth.post("/admin/register", async (c): Promise<Response> => {
  const body = await c.req.json();
  
  const adminRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    adminSecret: z.string(),
  });

  const ADMIN_SECRET = process.env.ADMIN_REGISTRATION_SECRET || "nara-admin-secret-2024";

  try {
    const validatedData = adminRegisterSchema.parse(body);

    // Verify admin secret
    if (validatedData.adminSecret !== ADMIN_SECRET) {
      return c.json({ 
        error: "Invalid admin secret",
        code: "INVALID_SECRET"
      }, 403);
    }

    const db = drizzle(c.env.DB, { schema });

    // Check if user already exists
    const existingUser = await getUserByEmail(db, validatedData.email);
    if (existingUser) {
      return c.json({ 
        error: "User already exists",
        code: "USER_EXISTS"
      }, 409);
    }

    // Create admin user
    const newAdmin = await createUser(db, {
      email: validatedData.email,
      password: validatedData.password,
      name: validatedData.name,
      role: "admin",
      // Admin accounts created via secret registration have no creator
      createdBy: null,
    });

    return c.json({
      success: true,
      message: "Admin account created successfully",
      admin: {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role,
      },
    }, 201);

  } catch (error) {
    console.error("Admin registration error:", error);
    
    if (error instanceof z.ZodError) {
      return c.json({ 
        error: "Validation failed", 
        details: error.issues,
        code: "VALIDATION_ERROR"
      }, 400);
    }

    return c.json({ 
      error: "Admin registration failed",
      code: "REGISTRATION_ERROR"
    }, 500);
  }
});

/**
 * User Deletion endpoint - Self-delete account
 * DELETE /api/auth/account
 */
auth.delete("/account", async (c): Promise<Response> => {
  try {
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

    // Import deleteUser function
    const { deleteUser } = await import("~/user.server");
    
    // Delete the user account
    const result = await deleteUser(db, tokenData.user.id);

    if (!result.success) {
      return c.json({ 
        error: result.error || "Failed to delete account",
        code: "DELETE_FAILED"
      }, 500);
    }

    return c.json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {
    console.error("Account deletion error:", error);
    return c.json({ 
      error: "Account deletion failed",
      code: "DELETE_ERROR"
    }, 500);
  }
});

export default auth;