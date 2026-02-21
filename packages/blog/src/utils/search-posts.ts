import type { BlogPost } from "@/types/mdx";

/**
 * Searches through an array of blog posts and filters them based on a query string.
 *
 * The search is case-insensitive and matches against the following fields:
 * - Post title
 * - Post description
 * - Post author
 * - Post tags
 *
 * @param posts - The array of blog posts to search through
 * @param query - The search query string. If empty or whitespace-only, returns all posts unchanged
 * @returns A filtered array of blog posts that match the search query in any of the searchable fields
 *
 * @example
 * ```typescript
 * const posts = [
 *   { frontmatter: { title: "React Tips", description: "...", author: "John", tags: ["react"] } },
 *   { frontmatter: { title: "Vue Guide", description: "...", author: "Jane", tags: ["vue"] } }
 * ];
 *
 * searchPosts(posts, "react"); // Returns posts matching "react" in title, description, author, or tags
 * searchPosts(posts, ""); // Returns all posts unchanged
 * ```
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;

  const lowerQuery = query.toLowerCase();

  return posts.filter((post) => {
    const titleMatch = post.frontmatter.title
      .toLowerCase()
      .includes(lowerQuery);
    const descriptionMatch = post.frontmatter.description
      ?.toLowerCase()
      .includes(lowerQuery);
    const authorMatch = post.frontmatter.author
      ?.toLowerCase()
      .includes(lowerQuery);
    const tagsMatch = post.frontmatter.tags?.some((tag) =>
      tag.toLowerCase().includes(lowerQuery),
    );

    return titleMatch || descriptionMatch || authorMatch || tagsMatch;
  });
}
