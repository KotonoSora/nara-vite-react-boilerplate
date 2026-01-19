import type { Showcase } from "~/database/contracts";

type SortableShowcaseFields = Extract<
  keyof Showcase,
  "name" | "createdAt" | "publishedAt"
>;

/**
 * Parameters for fetching showcases with filters, sorting, and pagination.
 */
export type FetchShowcasesParams = {
  page: number;
  pageSize: number;
  sortBy: SortableShowcaseFields;
  sortDir: "asc" | "desc";
  search?: string;
  tags?: string[];
  authorId?: string;
  authorName?: string;
  publishedAfter?: Date;
  publishedBefore?: Date;
  deleted?: "true" | "false";
  published?: "true" | "false";
  minScore?: number;
  viewerId?: string;
};
/**
 * Row type for a showcase, including userVote.
 */
export type ShowcaseRow = Showcase & { userVote?: -1 | 1 | null };

/**
 * Row type for a tag associated with a showcase.
 */
export type TagRow = { showcaseId: string; tagName: string };

/**
 * Row type for an author.
 */
export type AuthorRow = { id: string; email: string; name: string };

/**
 * Item representing a showcase in a list, with tags, author, and userVote.
 */
export type ShowcaseItem = Showcase & {
  tags: string[];
  author?: { id: string; email: string; name: string };
  userVote?: -1 | 1;
};

/**
 * Result of fetching showcases with pagination and filtering.
 */
export type FetchShowcasesResult = {
  items: ShowcaseItem[];
  page: number;
  pageSize: number;
  total: number;
};

/**
 * Model representing a paginated list of showcases.
 */
export type ListShowcaseResponse = {
  showcases: Showcase[];
  total: number;
  page: number;
  pageSize: number;
};
