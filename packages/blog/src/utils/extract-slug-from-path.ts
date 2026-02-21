import { BLOG_FILE_EXTENSIONS, CONTENT_BASE_PATHS } from "../config/constants";

/**
 * Escapes special regex characters in a string.
 * Backslashes are escaped first to prevent double-escaping issues.
 *
 * @param str - The string to escape
 * @returns The escaped string safe for use in RegExp
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts a slug from a file path.
 *
 * Matches file paths ending with `.md` or `.mdx` extensions from various content directories
 * and extracts the slug from the path. If the slug ends with `/index`, it removes that suffix.
 *
 * Uses standard path constants from the config to identify supported content sources.
 *
 * @param path - The file path to extract the slug from
 * @returns The extracted slug, or an empty string if the path doesn't match the expected pattern
 *
 * @example
 * extractSlugFromPath("/app/vault/my-post.mdx") // Returns "my-post"
 * extractSlugFromPath("/app/vault/docs/guide.md") // Returns "docs/guide"
 * extractSlugFromPath("/app/vault/tutorials/index.mdx") // Returns "tutorials"
 * extractSlugFromPath("/content/blog/my-post.md") // Returns "blog/my-post"
 * extractSlugFromPath("/invalid/path.md") // Returns ""
 */
export function extractSlugFromPath(path: string): string {
  // Build regex pattern from supported extensions
  const extensionPattern = `(${Object.values(BLOG_FILE_EXTENSIONS)
    .map((extension) => escapeRegExp(extension))
    .join("|")})$`;

  // Try each base path
  for (const basePath of Object.values(CONTENT_BASE_PATHS)) {
    // Remove trailing slash for consistency
    const cleanBasePath = basePath.replace(/\/$/, "");
    // Escape special regex characters and build pattern
    const escapedPath = escapeRegExp(cleanBasePath);
    const pattern = new RegExp(`${escapedPath}\/(.+)${extensionPattern}`);

    const match = path.match(pattern);
    if (match) {
      let slug = match[1];
      // Remove /index suffix if present
      if (slug.endsWith("/index")) {
        slug = slug.replace(/\/index$/, "");
      }
      return slug;
    }
  }

  return "";
}
