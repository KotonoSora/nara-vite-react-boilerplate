import { HTTPException } from "hono/http-exception";
import { z } from "zod";

import type { APIErrorResponse } from "~/workers/types";
import type { Context, MiddlewareHandler } from "hono";

/**
 * Manual Zod validator middleware for Hono
 * Since @hono/zod-validator is not available, this provides similar functionality
 */

type ValidationTarget = "json" | "query" | "param" | "form";

/**
 * Creates a validation middleware for Hono routes
 * @param target - Where to validate (json, query, param, form)
 * @param schema - Zod schema to validate against
 * @returns Middleware that validates request data
 */
export function zValidator<T extends z.ZodType>(
  target: ValidationTarget,
  schema: T,
): MiddlewareHandler {
  return async (c: Context, next) => {
    try {
      let data: unknown;

      switch (target) {
        case "json":
          data = await c.req.json();
          break;
        case "query":
          data = c.req.query();
          break;
        case "param":
          data = c.req.param();
          break;
        case "form":
          data = await c.req.formData();
          break;
        default:
          throw new Error(`Unsupported validation target: ${target}`);
      }

      const result = schema.safeParse(data);

      if (!result.success) {
        const errorResponse: APIErrorResponse = {
          success: false,
          error: "Validation failed",
          details: result.error.issues,
        };
        throw new HTTPException(400, {
          message: JSON.stringify(errorResponse),
        });
      }

      // Store validated data in context for use in handlers
      c.set(`validated_${target}`, result.data);
      await next();
    } catch (error) {
      if (error instanceof HTTPException) {
        throw error;
      }

      const errorResponse: APIErrorResponse = {
        success: false,
        error: "Invalid request data",
        details: error instanceof Error ? error.message : "Unknown error",
      };
      throw new HTTPException(400, { message: JSON.stringify(errorResponse) });
    }
  };
}

/**
 * Helper to get validated data from context
 * @param c - Hono context
 * @param target - Validation target that was used
 * @returns Validated and typed data
 */
export function getValidated<T>(c: Context, target: ValidationTarget): T {
  return c.get(`validated_${target}`) as T;
}

/**
 * Common validation schemas
 */
export const commonSchemas = {
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  uuid: z.uuid("Invalid UUID format"),
  pagination: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
  }),
};

/**
 * Authentication validation schemas
 */
export const authSchemas = {
  adminRegister: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
    adminSecret: z.string().min(1, "Admin secret is required"),
  }),

  memberRegister: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: commonSchemas.name,
  }),

  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),
};
