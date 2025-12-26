/**
 * Extracts a slug from a file path.
 *
 * Matches file paths ending with `.md` or `.mdx` extensions under a `/content/` directory
 * and extracts the slug from the path. If the slug ends with `/index`, it removes that suffix.
 *
 * @param path - The file path to extract the slug from
 * @returns The extracted slug, or an empty string if the path doesn't match the expected pattern
 *
 * @example
 * extractSlugFromPath("/content/blog/my-post.md") // Returns "blog/my-post"
 * extractSlugFromPath("/content/docs/guide/index.mdx") // Returns "docs/guide"
 * extractSlugFromPath("/invalid/path.md") // Returns ""
 */
export function extractSlugFromPath(path: string): string {
  const match = path.match(/\/content\/(.+)\.(md|mdx)$/);
  if (!match) return "";

  let slug = match[1];
  if (slug.endsWith("/index")) {
    slug = slug.replace(/\/index$/, "");
  }

  return slug;
}
