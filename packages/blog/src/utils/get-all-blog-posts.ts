import type { BlogPost } from "@/types/mdx";

import { extractSlugFromPath } from "./extract-slug-from-path";
import { getMdxModules } from "./mdx-loader";

export type LoadingCallback = (progress: {
  loaded: number;
  total: number;
  currentSlug?: string;
}) => void;

/**
 * Retrieves all blog posts from MDX modules and returns them sorted by date.
 *
 * This function iterates through all available MDX modules, extracts their metadata,
 * and filters out posts marked as unpublished. Posts are sorted in descending order
 * by publication date, with unpublished posts (no date) appearing last.
 *
 * @param onLoading - Optional callback to track loading progress
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts
 *                                 sorted by date in descending order (newest first).
 *
 * @throws Logs errors to console for individual posts that fail to load, but does
 *         not throw - the function will return successfully with all successfully
 *         loaded posts.
 *
 * @example
 * ```typescript
 * const posts = await getAllBlogPosts((progress) => {
 *   console.log(`Loading ${progress.loaded}/${progress.total} posts`);
 * });
 * posts.forEach(post => {
 *   console.log(post.frontmatter.title);
 * });
 * ```
 */
export async function getAllBlogPosts(
  onLoading?: LoadingCallback,
): Promise<BlogPost[]> {
  const modules = getMdxModules();
  const paths = Object.entries(modules);
  const total = paths.length;

  // Load all posts in parallel for better performance
  const loadedModules = await Promise.allSettled(
    paths.map(async ([path, loader], index) => {
      const module = await loader();
      const slug = extractSlugFromPath(path);

      // Notify progress
      onLoading?.({
        loaded: index + 1,
        total,
        currentSlug: slug,
      });

      return { path, slug, module };
    }),
  );

  const posts: BlogPost[] = [];

  for (const result of loadedModules) {
    if (result.status === "rejected") {
      console.error("Error loading blog post module:", result.reason);
      continue;
    }

    const { path, slug, module } = result.value;

    try {
      // Skip posts without a valid slug or marked as unpublished
      if (!slug || module.frontmatter?.published === false) {
        continue;
      }

      posts.push({
        slug,
        content: module.default,
        frontmatter: module.frontmatter || {
          title: slug,
          description: "",
          published: true,
        },
      });
    } catch (error) {
      console.error(`Error processing blog post at ${path}:`, error);
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
