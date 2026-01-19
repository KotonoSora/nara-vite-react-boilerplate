import { endOfDay, isValid, parse, parseISO, startOfDay } from "date-fns";
import { z } from "zod";

/**
 * Validation schema for listing showcases with filters and pagination.
 */
export const listShowcaseValidator = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  sortBy: z.enum(["name", "createdAt", "publishedAt"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().min(1).optional(),
  tags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => (typeof val === "string" ? [val.trim()] : val))
    .optional(),
  authorId: z.string().min(1).optional(),
  authorName: z.string().min(1).optional(),
  publishedAfter: z
    .union([
      z.coerce.number().transform((val) => new Date(val)),
      z.coerce.date(),
      z.string().transform((val) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          const parsed = parse(val, "yyyy-MM-dd", new Date());
          if (!isValid(parsed)) throw new Error("Invalid date format");
          return startOfDay(parsed);
        }
        const parsed = parseISO(val);
        if (!isValid(parsed)) throw new Error("Invalid ISO date format");
        return parsed;
      }),
    ])
    .optional(),
  publishedBefore: z
    .union([
      z.coerce.number().transform((val) => new Date(val)),
      z.coerce.date(),
      z.string().transform((val) => {
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
          const parsed = parse(val, "yyyy-MM-dd", new Date());
          if (!isValid(parsed)) throw new Error("Invalid date format");
          return endOfDay(parsed);
        }
        const parsed = parseISO(val);
        if (!isValid(parsed)) throw new Error("Invalid ISO date format");
        return parsed;
      }),
    ])
    .optional(),
  deleted: z.enum(["true", "false"]).optional(),
  published: z.enum(["true", "false"]).optional(),
  minScore: z.coerce.number().int().min(0).optional(),
  viewerId: z.string().min(1).optional(),
});

export type ListShowcaseQuery = z.infer<typeof listShowcaseValidator>;
