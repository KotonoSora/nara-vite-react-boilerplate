import type { MDXModule } from "../types/mdx";

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
