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
    .min(1, "showcase.validation.nameRequired")
    .min(3, "showcase.validation.nameMinLength"),
  description: z
    .string()
    .trim()
    .min(1, "showcase.validation.descriptionRequired")
    .min(10, "showcase.validation.descriptionMinLength"),
  url: z.url("showcase.validation.urlInvalid").trim(),
  image: z
    .url("showcase.validation.imageUrlInvalid")
    .trim()
    .or(z.literal(""))
    .optional(),
  publishedAt: z
    .union([
      z.date(),
      z.string().transform((val) => (val ? new Date(val) : undefined)),
    ])
    .optional(),
  authorId: z.string().trim().optional(),
  tags: z
    .array(z.string().trim().min(1, "showcase.validation.tagEmpty"))
    .default([]),
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
