import type { Context } from "hono";

/**
 * Centralized error handler for API endpoints.
 * Logs the error and returns a standardized JSON response.
 */
export const handleError = (
  error: unknown,
  c: Context,
  defaultMessage: string = "Internal Server Error",
) => {
  const message =
    error instanceof Error ? error.message : "Unknown error occurred";
  console.error(defaultMessage, error);
  return c.json({ error: defaultMessage, details: message }, 500);
};
