import type { BlogPost } from "../types/mdx";

/**
 * Extracts all unique tags from a collection of blog posts and returns them in sorted order.
 *
 * @param posts - An array of blog posts to extract tags from.
 * @returns An array of unique tags sorted alphabetically.
 *
 * @example
 * ```typescript
 * const posts = [
 *   { frontmatter: { tags: ['react', 'typescript'] } },
 *   { frontmatter: { tags: ['react', 'javascript'] } }
 * ];
 * getAllTags(posts); // ['javascript', 'react', 'typescript']
 * ```
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}
