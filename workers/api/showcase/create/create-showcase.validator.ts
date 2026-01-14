import { z } from "zod";

/**
 * Validation schema for creating a new showcase.
 */
export const createShowcaseValidator = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  url: z.url("Invalid URL"),
  image: z.url("Invalid image URL").optional(),
  publishedAt: z
    .union([z.number(), z.string()])
    .transform((val) =>
      typeof val === "string"
        ? val
          ? new Date(val)
          : undefined
        : new Date(val),
    )
    .optional(),
  tags: z.array(z.string().min(1)).default([]),
  authorId: z.string().min(1).optional(),
});

export type CreateShowcaseInput = z.infer<typeof createShowcaseValidator>;
