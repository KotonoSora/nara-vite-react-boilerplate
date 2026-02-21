import type { BlogPost } from "@/types/mdx";

/**
 * Sorts an array of blog posts by their publication date.
 *
 * @param posts - An array of blog posts to be sorted.
 * @param order - The order in which to sort the posts.
 *                Use "asc" for ascending order and "desc" for descending order.
 *                Defaults to "desc".
 * @returns A new array of blog posts sorted by date.
 *
 * @example
 * const sortedPosts = sortPostsByDate(posts, "asc");
 */
export function sortPostsByDate(
  posts: BlogPost[],
  order: "asc" | "desc" = "desc",
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;

    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
}
