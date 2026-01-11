import { z } from "zod";

export const deleteShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "showcase.validation.showcaseIdRequired"),
});
