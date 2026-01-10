import { z } from "zod";

/**
 * Zod schema for showcase creation validation.
 * Used across: modal (client-side), action route, and API routes.
 * Supports both string and Date types for publishedAt to handle different input sources.
 */
export const createShowcaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),
  url: z.url("Please enter a valid URL").trim(),
  image: z.url("Invalid image URL").trim().or(z.literal("")).optional(),
  publishedAt: z
    .union([
      z.date(),
      z.string().transform((val) => (val ? new Date(val) : undefined)),
    ])
    .optional(),
  authorId: z.string().trim().optional(),
  tags: z.array(z.string().trim().min(1, "Tag cannot be empty")).default([]),
});

export type CreateShowcaseInput = z.infer<typeof createShowcaseSchema>;

/**
 * Type for field-level validation errors.
 * Maps field names to their error messages.
 */
export type FieldError = Record<string, string>;

/**
 * Parse Zod validation result and return field errors or null.
 *
 * @param result - SafeParse result from Zod
 * @returns FieldError object if validation fails, null if successful
 */
export function parseValidationErrors(
  result: ReturnType<typeof createShowcaseSchema.safeParse>,
): FieldError | null {
  if (result.success) return null;

  const fieldErrors: FieldError = {};
  for (const issue of result.error.issues) {
    const fieldPath = issue.path.join(".");
    if (fieldPath) {
      fieldErrors[fieldPath] = issue.message;
    }
  }
  return fieldErrors;
}
