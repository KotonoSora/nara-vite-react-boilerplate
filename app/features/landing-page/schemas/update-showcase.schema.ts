import { z } from "zod";

export const updateShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "Showcase ID is required"),
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
  tags: z.array(z.string().trim().min(1, "Tag cannot be empty")).default([]),
});

export type UpdateShowcaseData = z.infer<typeof updateShowcaseSchema>;

/**
 * Type for field-level validation errors.
 * Maps field names to their error messages.
 */
export type FieldError = Record<string, string>;

/**
 * Parses Zod validation errors into field-level error messages.
 */
export function parseValidationErrors(
  result: ReturnType<typeof updateShowcaseSchema.safeParse>,
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
