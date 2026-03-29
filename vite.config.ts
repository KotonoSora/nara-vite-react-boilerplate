import { cloudflare } from "@cloudflare/vite-plugin";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import mdxMermaid from "mdx-mermaid";
import rehypeHighlight from "rehype-highlight";
import rehypeMathjax from "rehype-mathjax";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";

import type { Plugin, UserConfig } from "vite";

import type { Options as MdxOptions } from "@mdx-js/rollup";

const mdxOptions: MdxOptions = {
  providerImportSource: "@mdx-js/react",
  remarkPlugins: [
    remarkMath,
    mdxMermaid,
    remarkGfm,
    remarkFrontmatter,
    [remarkMdxFrontmatter, { name: "frontmatter" }],
  ],
  rehypePlugins: [rehypeHighlight, rehypeMathjax],
};

const reactRouterWithOxcCompat = (): Plugin[] => {
  return reactRouter().map((plugin) => {
    if (!plugin.config) {
      return plugin;
    }

    const originalConfig = plugin.config;

    return {
      ...plugin,
      async config(...args) {
        const result =
          typeof originalConfig === "function"
            ? await originalConfig.apply(this, args as never)
            : originalConfig;

        if (!result || typeof result !== "object" || Array.isArray(result)) {
          return result;
        }

        const viteConfig = { ...result } as UserConfig & {
          esbuild?: Record<string, unknown> | false;
        };

        delete viteConfig.esbuild;
        return viteConfig;
      },
    } as Plugin;
  });
};

export default defineConfig(() => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    mdx(mdxOptions),
    ...reactRouterWithOxcCompat(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ],
}));
