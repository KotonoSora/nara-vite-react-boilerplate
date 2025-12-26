import { extractSlugFromPath } from "./extract-slug-from-path";
import { mdxModules } from "./mdx-loader";

/**
 * Retrieves metadata for all blog posts.
 *
 * @returns An array of blog post metadata objects, each containing a slug and path.
 * @returns {string} returns[].slug - The URL-friendly slug derived from the post path.
 * @returns {string} returns[].path - The file path to the blog post module.
 */
export function getBlogPostsMetadata(): Array<{
  slug: string;
  path: string;
}> {
  return Object.keys(mdxModules).map((path) => ({
    slug: extractSlugFromPath(path),
    path,
  }));
}
