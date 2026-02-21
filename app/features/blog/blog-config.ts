import { createBlogModulesConfig } from "@kotonosora/blog";

import type { MDXModule } from "@kotonosora/blog";

/**
 * MDX modules configuration for the blog feature.
 *
 * This configuration loads blog content from the app vault:
 * - `/app/vault/**\\/*.{md,mdx}` - Markdown and MDX posts
 *
 * Note: import.meta.glob() requires literal strings (not variables) because
 * Vite needs to analyze the glob patterns at build time.
 */

// Load modules using standard paths
// Note: Must use literal strings here, not constants
export const blogMdxModules = createBlogModulesConfig(
  import.meta.glob<MDXModule>("/app/vault/**/*.{md,mdx}", {
    eager: false,
  }),
);
