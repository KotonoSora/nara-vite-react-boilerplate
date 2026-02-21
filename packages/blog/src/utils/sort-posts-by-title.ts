import type { BlogPost } from "@/types/mdx";

/**
 * Sorts an array of blog posts by their titles.
 *
 * @param posts - An array of blog posts to be sorted.
 * @param order - The order in which to sort the titles.
 *                Use "asc" for ascending order and "desc" for descending order.
 *                Defaults to "asc".
 * @returns A new array of blog posts sorted by title in the specified order.
 */
export function sortPostsByTitle(
  posts: BlogPost[],
  order: "asc" | "desc" = "asc",
): BlogPost[] {
  return [...posts].sort((a, b) => {
    const comparison = a.frontmatter.title.localeCompare(b.frontmatter.title);
    return order === "desc" ? -comparison : comparison;
  });
}
