import type { Tag } from "~/database/contracts";

/**
 * Tag with aggregated showcase count, based on schema type.
 */
export type TagWithCount = Tag & { count: number };

/**
 * Item representing a tag for API response.
 */
export type ShowcaseTagItem = Pick<
  Tag,
  "id" | "name" | "slug" | "createdAt"
> & { count: number };

/**
 * Result of fetching showcase tags with pagination and filtering.
 */
export type FetchShowcaseTagsResult = {
  items: ShowcaseTagItem[];
  page: number;
  pageSize: number;
  total: number;
};
/**
 * Model representing a paginated list of showcase tags with counts.
 */
export type TagsShowcaseResponse = {
  tags: Array<{ tag: string; count: number }>;
  total: number;
  page: number;
  pageSize: number;
};
