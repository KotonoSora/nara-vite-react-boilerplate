import type { MDXModule } from "../types/mdx";

/**
 * Dynamically imports all MDX modules from the blog content directory.
 *
 * @remarks
 * Uses Vite's `import.meta.glob` to lazy-load all markdown and MDX files
 * from the blog content folder and its subdirectories. The `eager: false`
 * option ensures modules are loaded on-demand rather than upfront.
 *
 * @type {Record<string, () => Promise<MDXModule>>}
 *
 * @example
 * ```typescript
 * const module = await mdxModules['/app/features/blog/content/post.mdx']();
 * ```
 */
export const mdxModules: Record<string, () => Promise<MDXModule>> =
  import.meta.glob<MDXModule>("/app/features/blog/content/**/*.{md,mdx}", {
    eager: false,
  });
