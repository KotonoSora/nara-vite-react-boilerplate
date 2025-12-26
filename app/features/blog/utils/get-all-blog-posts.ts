import type { BlogPost } from "../types/mdx";

import { extractSlugFromPath } from "./extract-slug-from-path";
import { mdxModules } from "./mdx-loader";

/**
 * Retrieves all blog posts from MDX modules and returns them sorted by date.
 *
 * This function iterates through all available MDX modules, extracts their metadata,
 * and filters out posts marked as unpublished. Posts are sorted in descending order
 * by publication date, with unpublished posts (no date) appearing last.
 *
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts
 *                                 sorted by date in descending order (newest first).
 *
 * @throws Logs errors to console for individual posts that fail to load, but does
 *         not throw - the function will return successfully with all successfully
 *         loaded posts.
 *
 * @example
 * ```typescript
 * const posts = await getAllBlogPosts();
 * posts.forEach(post => {
 *   console.log(post.frontmatter.title);
 * });
 * ```
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  for (const [path, loader] of Object.entries(mdxModules)) {
    try {
      const module = await loader();
      const slug = extractSlugFromPath(path);

      if (module.frontmatter?.published !== false) {
        posts.push({
          slug,
          content: module.default,
          frontmatter: module.frontmatter || {
            title: slug,
            description: "",
            published: true,
          },
        });
      }
    } catch (error) {
      console.error(`Error loading blog post at ${path}:`, error);
    }
  }

  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date
      ? new Date(a.frontmatter.date).getTime()
      : 0;
    const dateB = b.frontmatter.date
      ? new Date(b.frontmatter.date).getTime()
      : 0;
    return dateB - dateA;
  });
}
