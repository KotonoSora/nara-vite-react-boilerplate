import type { MDXModule } from "@/types/mdx";

/**
 * Global MDX modules registry.
 *
 * @remarks
 * This is initialized as an empty object and should be configured by the consuming
 * application using the `configureMdxModules` function. This approach makes the
 * blog package independent from any specific Vite configuration or content location.
 *
 * @internal
 */
let mdxModulesRegistry: Record<string, () => Promise<MDXModule>> = {};

/**
 * Configures the MDX modules registry with lazy-loaded module functions.
 *
 * @param modules - A record of file paths to lazy module loaders
 *
 * @remarks
 * This function should be called once during application initialization, typically
 * in your app's entry point or before rendering blog components. The modules
 * parameter should contain the result of Vite's `import.meta.glob` or a similar
 * dynamic import mechanism.
 *
 * @example
 * ```typescript
 * // In your app's initialization (e.g., app/entry.server.tsx or main.tsx)
 * import { configureMdxModules } from '@kotonosora/blog';
 *
 * configureMdxModules(
 *   import.meta.glob("/app/features/blog/content/**\/*.{md,mdx}", {
 *     eager: false,
 *   })
 * );
 * ```
 */
export function configureMdxModules(
  modules: Record<string, () => Promise<MDXModule>>,
): void {
  mdxModulesRegistry = modules;
}

/**
 * Gets the configured MDX modules.
 *
 * @returns The current MDX modules registry
 *
 * @remarks
 * Returns an empty object if `configureMdxModules` has not been called yet.
 * Consumer applications should call `configureMdxModules` during initialization.
 */
export function getMdxModules(): Record<string, () => Promise<MDXModule>> {
  return mdxModulesRegistry;
}
