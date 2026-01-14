import type { Context, Next } from "hono";

/**
 * Middleware to restrict access to development environment only.
 * Returns 403 if accessed outside development mode.
 */
export const devOnlyMiddleware = async (c: Context, next: Next) => {
  if (import.meta.env.MODE !== "development") {
    return c.json({ error: "Endpoint available only in development." }, 403);
  }

  return next();
};
