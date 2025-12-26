import type { BlogPost } from "../types/mdx";

/**
 * Retrieves a sorted array of unique authors from an array of blog posts.
 *
 * @param posts - An array of blog posts, where each post contains frontmatter with an author field.
 * @returns An array of unique author names sorted in ascending order.
 */
export function getAllAuthors(posts: BlogPost[]): string[] {
  const authors = new Set<string>();

  posts.forEach((post) => {
    if (post.frontmatter.author) {
      authors.add(post.frontmatter.author);
    }
  });

  return Array.from(authors).sort();
}
