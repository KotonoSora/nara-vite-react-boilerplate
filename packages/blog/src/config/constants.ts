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
