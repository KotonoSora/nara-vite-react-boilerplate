import { getMdxModules } from "./mdx-loader";

/**
 * Gets the module path for a given slug
 * @param slug - The blog post slug
 * @returns The path to the MDX module file, or undefined if not found
 */
export function getMdxModulePath(slug: string): string | undefined {
  const modules = getMdxModules();

  for (const [path, _loader] of Object.entries(modules)) {
    const fileName = path
      .split("/")
      .pop()
      ?.replace(/\.(mdx?|md)$/, "");

    const isDirectMatch = fileName === slug;
    const isIndexMatch = fileName === "index" && path.includes(`/${slug}/`);

    if (isDirectMatch || isIndexMatch) {
      return path;
    }
  }

  return undefined;
}
