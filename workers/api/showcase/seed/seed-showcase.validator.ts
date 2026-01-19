import { z } from "zod";

/**
 * Validation schema for seeding showcases.
 * Requires at least one showcase with required fields.
 */
export const seedShowcaseValidator = z.object({
  showcases: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        url: z.url(),
        image: z.url().optional(),
        tags: z.array(z.string().min(1)).default([]),
        authorId: z.string().optional(),
        publishedAt: z
          .union([z.number(), z.coerce.date()])
          .transform((val) => (typeof val === "number" ? new Date(val) : val))
          .optional(),
      }),
    )
    .min(1, "Provide at least one showcase to seed."),
});

export type SeedShowcaseInput = z.infer<typeof seedShowcaseValidator>;
