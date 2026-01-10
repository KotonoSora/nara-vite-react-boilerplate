import { z } from "zod";

/**
 * Validates user voting payload for a showcase.
 * Accepts form-data strings and normalizes `value` to -1 | 1.
 */
export const voteShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "Showcase ID is required"),
  userId: z.string().min(1, "User ID is required"),
  value: z
    .enum(["-1", "1"], {
      message: "Vote value must be -1 or 1",
    })
    .transform((v) => (v === "1" ? 1 : -1)),
});

export type VoteShowcaseInput = z.infer<typeof voteShowcaseSchema>;
