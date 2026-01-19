import { z } from "zod";

/**
 * Validation schema for fetching showcase tags with pagination.
 */
export const tagsShowcaseValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["tag", "count"]).default("tag"),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
  deleted: z.enum(["true", "false"]).optional(),
});

export type TagsShowcaseQuery = z.infer<typeof tagsShowcaseValidator>;
