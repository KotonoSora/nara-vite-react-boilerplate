import { sql } from "drizzle-orm";
import { Hono } from "hono";

import type {
  APIErrorResponse,
  APISuccessResponse,
  HonoBindings,
} from "~/workers/types";

import * as schema from "~/database/schema";
import { MAX_USERS } from "~/features/shared/constants/limit";
import { getDbOrFail } from "~/workers/api/utils/db";
import {
  authSchemas,
  getValidated,
  zValidator,
} from "~/workers/api/utils/validation";
import { HTTP_STATUS } from "~/workers/types";

const { user } = schema;

const app = new Hono<HonoBindings>();

const ADMIN_SECRET = process.env.ADMIN_REGISTRATION_SECRET;

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
 * - 200: { success: true, data: { admin: { id, email, name, role } } }
 * - 403: { success: false, error: "Invalid admin secret" | "Registration limit reached" }
 * - 409: { success: false, error: "User already exists" }
 * - 400: { success: false, error: "Validation failed", details }
 * - 500: { success: false, error: "Admin registration failed" }
 *
 * Type safety: Uses Drizzle ORM and Zod for validation.
 * Security: Requires correct adminSecret for registration.
 */
app.post(
  "/admin/register",
  zValidator("json", authSchemas.adminRegister),
  async (c): Promise<Response> => {
    const db = getDbOrFail<typeof schema>(c, schema);
    if (db instanceof Response) return db;

    // Check user limit
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .get();

    if (typeof MAX_USERS === "number" && (userCount?.count ?? 0) >= MAX_USERS) {
      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Registration limit reached",
      };
      return c.json(errorResponse, HTTP_STATUS.FORBIDDEN);
    }

    try {
      const validatedData = getValidated<{
        email: string;
        password: string;
        name: string;
        adminSecret: string;
      }>(c, "json");

      // Verify admin secret
      if (validatedData.adminSecret !== ADMIN_SECRET) {
        const errorResponse: APIErrorResponse = {
          success: false,
          error: "Invalid admin secret",
        };
        return c.json(errorResponse, HTTP_STATUS.FORBIDDEN);
      }

      const { getUserByEmail, createUser } = await import(
        "~/lib/auth/user.server"
      );

      // Check if user already exists
      const existingUser = await getUserByEmail(db, validatedData.email);
      if (existingUser) {
        const errorResponse: APIErrorResponse = {
          success: false,
          error: "User already exists",
        };
        return c.json(errorResponse, HTTP_STATUS.CONFLICT);
      }

      // Create admin user
      const newAdmin = await createUser(db, {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        role: "admin",
      });

      const successResponse: APISuccessResponse = {
        success: true,
        data: {
          admin: {
            id: newAdmin.id,
            email: newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role,
          },
        },
      };

      return c.json(successResponse, HTTP_STATUS.CREATED);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Admin registration error:", error);
      }

      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Admin registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },
);

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
 * - 201: { success: true, data: { user: { id, email, name, role } } }
 * - 403: { success: false, error: "Registration limit reached" }
 * - 409: { success: false, error: "User already exists" }
 * - 400: { success: false, error: "Validation failed", details }
 * - 500: { success: false, error: "Member registration failed" }
 *
 * Type safety: Uses Drizzle ORM and Zod for validation.
 * Security: Does not require admin secret.
 */
app.post(
  "/member/register",
  zValidator("json", authSchemas.memberRegister),
  async (c): Promise<Response> => {
    const db = getDbOrFail<typeof schema>(c, schema);
    if (db instanceof Response) return db;

    // Check user limit
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(user)
      .get();

    if (typeof MAX_USERS === "number" && (userCount?.count ?? 0) >= MAX_USERS) {
      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Registration limit reached",
      };
      return c.json(errorResponse, HTTP_STATUS.FORBIDDEN);
    }

    try {
      const validatedData = getValidated<{
        email: string;
        password: string;
        name: string;
      }>(c, "json");

      const { getUserByEmail, createUser } = await import(
        "~/lib/auth/user.server"
      );

      // Check if user already exists
      const existingUser = await getUserByEmail(db, validatedData.email);
      if (existingUser) {
        const errorResponse: APIErrorResponse = {
          success: false,
          error: "User already exists",
        };
        return c.json(errorResponse, HTTP_STATUS.CONFLICT);
      }

      // Create member user
      const newUser = await createUser(db, {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        role: "user",
      });

      const successResponse: APISuccessResponse = {
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
      };

      return c.json(successResponse, HTTP_STATUS.CREATED);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Member registration error:", error);
      }

      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Member registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      return c.json(errorResponse, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  },
);

export default app;
