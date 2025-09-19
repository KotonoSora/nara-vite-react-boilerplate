import type { APIErrorResponse, APISuccessResponse } from "~/workers/types";
import type { Context } from "hono";

import { HTTP_STATUS } from "~/workers/types";

/**
 * Response helper utilities for consistent API responses
 * Following Hono.js best practices for standardized response formats
 */

/**
 * Success response helper
 */
export function createSuccessResponse<T = unknown>(
  data?: T,
  message?: string,
): APISuccessResponse<T> {
  return {
    success: true,
    ...(data !== undefined && { data }),
    ...(message && { message }),
  };
}

/**
 * Error response helper
 */
export function createErrorResponse(
  error: string,
  details?: unknown,
): APIErrorResponse {
  return {
    success: false,
    error,
    ...(details !== undefined && { details }),
  };
}

/**
 * Send success JSON response
 */
export function sendSuccess<T = unknown>(
  c: Context,
  data?: T,
  message?: string,
  status: number = HTTP_STATUS.OK,
): Response {
  return c.json(createSuccessResponse(data, message), status as any);
}

/**
 * Send error JSON response
 */
export function sendError(
  c: Context,
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  details?: unknown,
): Response {
  const errorResponse = createErrorResponse(error, details);
  return c.json(errorResponse, status as any);
}

/**
 * Send created response (201)
 */
export function sendCreated<T = unknown>(
  c: Context,
  data?: T,
  message?: string,
): Response {
  return sendSuccess(c, data, message, HTTP_STATUS.CREATED);
}

/**
 * Send bad request response (400)
 */
export function sendBadRequest(
  c: Context,
  error: string = "Bad Request",
  details?: unknown,
): Response {
  return sendError(c, error, HTTP_STATUS.BAD_REQUEST, details);
}

/**
 * Send not found response (404)
 */
export function sendNotFound(
  c: Context,
  error: string = "Not Found",
): Response {
  return sendError(c, error, HTTP_STATUS.NOT_FOUND);
}

/**
 * Send forbidden response (403)
 */
export function sendForbidden(
  c: Context,
  error: string = "Forbidden",
): Response {
  return sendError(c, error, HTTP_STATUS.FORBIDDEN);
}

/**
 * Send conflict response (409)
 */
export function sendConflict(c: Context, error: string = "Conflict"): Response {
  return sendError(c, error, HTTP_STATUS.CONFLICT);
}

/**
 * Send unauthorized response (401)
 */
export function sendUnauthorized(
  c: Context,
  error: string = "Unauthorized",
): Response {
  return sendError(c, error, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Handle and send error response with proper logging
 */
export function handleError(
  c: Context,
  error: unknown,
  fallbackMessage: string = "Internal Server Error",
  fallbackStatus: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response {
  // Log error in development
  if (import.meta.env.DEV) {
    console.error("API Error:", error);
  }

  const errorMessage = error instanceof Error ? error.message : fallbackMessage;
  const details = import.meta.env.DEV
    ? error instanceof Error
      ? error.stack
      : String(error)
    : undefined;

  return sendError(c, errorMessage, fallbackStatus, details);
}

/**
 * Paginated response helper
 */
export function sendPaginated<T>(
  c: Context,
  items: T[],
  total: number,
  page: number,
  limit: number,
  message?: string,
): Response {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return sendSuccess(
    c,
    {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext,
        hasPrev,
      },
    },
    message,
  );
}
