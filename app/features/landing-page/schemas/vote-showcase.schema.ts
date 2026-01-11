import { z } from "zod";

/**
 * Validates user voting payload for a showcase.
 * Accepts form-data strings and normalizes `value` to -1 | 1.
 */
export const voteShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "showcase.validation.showcaseIdRequired"),
  userId: z.string().min(1, "showcase.validation.userIdRequired"),
  value: z
    .enum(["-1", "1"], {
      message: "showcase.validation.voteValueInvalid",
    })
    .transform((v) => (v === "1" ? 1 : -1)),
});

export type VoteShowcaseInput = z.infer<typeof voteShowcaseSchema>;
