import { z } from "zod";

export const publishShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "Showcase ID is required"),
});
