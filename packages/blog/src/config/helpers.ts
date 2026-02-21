import type { MDXModule } from "../types/mdx";

import { BLOG_CONTENT_PATHS } from "./constants";

/**
 * Creates a blog modules configuration object from import.meta.glob calls.
 *
 * @param modules - Modules from app markdown and MDX files
 * @param extraModules - Optional extra modules to merge
 * @returns Combined modules object ready for configureMdxModules
 *
 * @example
 * ```typescript
 * import { createBlogModulesConfig } from '@kotonosora/blog';
 *
 * const blogMdxModules = createBlogModulesConfig(
 *   import.meta.glob("/app/vault/**\\/*.{md,mdx}", { eager: false })
 * );
 * ```
 */
export function createBlogModulesConfig(
  modules: Record<string, () => Promise<MDXModule>> = {},
  extraModules: Record<string, () => Promise<MDXModule>> = {},
): Record<string, () => Promise<MDXModule>> {
  return {
    ...modules,
    ...extraModules,
  };
}

/**
 * Returns an array of all standard blog content path patterns.
 * Use this with import.meta.glob to load blog content.
 *
 * @returns Array of glob patterns for blog content
 *
 * @example
 * ```typescript
 * import { getStandardBlogPaths } from '@kotonosora/blog';
 *
 * const patterns = getStandardBlogPaths();
 * // Returns: ["/app/vault/**\\/*.{md,mdx}"]
 * ```
 */
export function getStandardBlogPaths(): string[] {
  return [BLOG_CONTENT_PATHS.APP_MARKDOWN_MDX];
}
