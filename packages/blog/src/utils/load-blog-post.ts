import type { BlogPost } from "@/types/mdx";

import { getMdxModules } from "./mdx-loader";

/**
 * Loads a blog post by slug, searching through all configured MDX modules.
 *
 * @param slug - The blog post slug used to match against file paths
 * @returns A promise that resolves to a BlogPost object if found, or null if no matching post is located
 * @throws Does not throw; errors during module loading are caught and logged to console
 *
 * @remarks
 * This function searches through all configured MDX modules to find a post matching the slug.
 * It supports multiple file naming patterns:
 * - Direct files: `{slug}.mdx` or `{slug}.md`
 * - Index files in folders: `{slug}/index.mdx` or `{slug}/index.md`
 *
 * The search is path-agnostic, meaning posts can be located in any folder structure
 * as long as they're included in the configured modules.
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
  const modules = getMdxModules();

  // Search through all configured modules to find matching slug
  for (const [path, loader] of Object.entries(modules)) {
    // Extract filename without extension from path
    const fileName = path
      .split("/")
      .pop()
      ?.replace(/\.(mdx?|md)$/, "");

    // Check if this path matches the slug
    // Supports both direct files (slug.mdx) and index files (slug/index.mdx)
    const isDirectMatch = fileName === slug;
    const isIndexMatch = fileName === "index" && path.includes(`/${slug}/`);

    if (isDirectMatch || isIndexMatch) {
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
