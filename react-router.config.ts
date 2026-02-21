import { readdir } from "node:fs/promises";
import path from "node:path";

import type { Config } from "@react-router/dev/config";

const APP_VAULT_DIR = path.resolve("app/vault");

async function collectVaultSlugs(dir: string, baseDir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const slugs: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      slugs.push(...(await collectVaultSlugs(fullPath, baseDir)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!entry.name.endsWith(".md") && !entry.name.endsWith(".mdx")) {
      continue;
    }

    const relativePath = path.relative(baseDir, fullPath);
    const withoutExt = relativePath.replace(/\.(md|mdx)$/i, "");
    const normalized = withoutExt.split(path.sep).join("/");
    const slug = normalized.endsWith("/index")
      ? normalized.slice(0, -"/index".length)
      : normalized;

    if (slug) {
      slugs.push(slug);
    }
  }

  return slugs;
}

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  async prerender() {
    const slugs = await collectVaultSlugs(APP_VAULT_DIR, APP_VAULT_DIR);
    const blogRoutes = slugs.map((slug) => `/blog/${slug}`);
    return ["/blog", ...blogRoutes];
  },
  future: {
    v8_middleware: true,
    v8_splitRouteModules: true,
    v8_viteEnvironmentApi: true,
    unstable_optimizeDeps: true,
    unstable_subResourceIntegrity: true,
  },
} satisfies Config;
