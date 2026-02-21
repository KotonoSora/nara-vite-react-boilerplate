/**
 * Standard blog content paths configuration.
 *
 * These are the recommended paths for organizing blog content:
 * - App markdown and MDX files for blog posts
 *
 * **Important:** These constants are for documentation and reference.
 * When using `import.meta.glob()`, you must use literal strings because
 * Vite requires glob patterns to be statically analyzable at build time.
 *
 * @example
 * ```typescript
 * // ✅ Correct - using literal strings
 * const modules = import.meta.glob("/app/vault/**\\/*.{md,mdx}", { eager: false });
 *
 * // ❌ Incorrect - variables not supported
 * const modules = import.meta.glob(BLOG_CONTENT_PATHS.APP_MARKDOWN_MDX, { eager: false });
 * ```
 */
export const BLOG_CONTENT_PATHS = {
  /**
   * Path pattern for app markdown and MDX files
   * These files are bundled with the app
   */
  APP_MARKDOWN_MDX: "/app/vault/**/*.{md,mdx}",
} as const;

/**
 * Base folder paths for content extraction.
 * Used by slug extraction logic to identify content sources.
 */
export const CONTENT_BASE_PATHS = {
  /**
   * App vault base path
   */
  APP_VAULT: "/app/vault/",
} as const;

/**
 * File extensions supported for blog content
 */
export const BLOG_FILE_EXTENSIONS = {
  MARKDOWN: ".md",
  MDX: ".mdx",
} as const;
