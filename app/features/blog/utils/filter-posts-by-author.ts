import type { BlogPost } from "../types/mdx";

/**
 * Filters an array of blog posts by author name.
 * @param posts - The array of blog posts to filter
 * @param author - The author name to filter by (case-insensitive)
 * @returns A new array containing only posts by the specified author, or all posts if author is empty
 */
export function filterPostsByAuthor(
  posts: BlogPost[],
  author: string,
): BlogPost[] {
  if (!author) return posts;

  return posts.filter(
    (post) => post.frontmatter.author?.toLowerCase() === author.toLowerCase(),
  );
}
