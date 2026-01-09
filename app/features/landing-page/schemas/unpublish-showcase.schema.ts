import { z } from "zod";

export const unpublishShowcaseSchema = z.object({
  showcaseId: z.string().min(1, "Showcase ID is required"),
});
