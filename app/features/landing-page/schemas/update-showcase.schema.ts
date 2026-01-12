import { z } from "zod";

export const updateShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "showcase.validation.showcaseIdRequired"),
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
  tags: z
    .array(z.string().trim().min(1, "showcase.validation.tagEmpty"))
    .default([]),
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
