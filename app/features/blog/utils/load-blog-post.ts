import type { BlogPost } from "../types/mdx";

import { mdxModules } from "./mdx-loader";

/**
 * Loads a blog post by slug, attempting multiple possible file paths and formats.
 *
 * @param slug - The blog post slug used to construct possible file paths
 * @returns A promise that resolves to a BlogPost object if found, or null if no matching post is located
 * @throws Does not throw; errors during module loading are caught and logged to console
 *
 * @remarks
 * This function attempts to load blog posts from multiple possible locations and formats:
 * - `.mdx` and `.md` files in the content directory
 * - `index.mdx` and `index.md` files in subdirectories
 *
 * If a module is successfully loaded, the default export is used as content and frontmatter
 * is extracted from the module's frontmatter property. If frontmatter is missing, a default
 * object with title (slug), empty description, and published=true is provided.
 *
 * @example
 * ```typescript
 * const post = await loadBlogPost('my-first-post');
 * if (post) {
 *   console.log(post.content);
 *   console.log(post.frontmatter.title);
 * }
 * ```
 */
export async function loadBlogPost(slug: string): Promise<BlogPost | null> {
  const possiblePaths = [
    `/app/features/blog/content/${slug}.mdx`,
    `/app/features/blog/content/${slug}.md`,
    `/app/features/blog/content/${slug}/index.mdx`,
    `/app/features/blog/content/${slug}/index.md`,
  ];

  for (const path of possiblePaths) {
    const loader = mdxModules[path];
    if (loader) {
      try {
        const module = await loader();
        return {
          slug,
          content: module.default,
          frontmatter: module.frontmatter || {
            title: slug,
            description: "",
            published: true,
          },
        };
      } catch (error) {
        console.error(`Error loading blog post at ${path}:`, error);
        continue;
      }
    }
  }

  return null;
}
