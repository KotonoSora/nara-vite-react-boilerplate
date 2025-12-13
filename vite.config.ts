/// <reference types="vitest/config" />

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
import babel from "vite-plugin-babel";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(() => ({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    mdx({
      providerImportSource: "@mdx-js/react",
      remarkPlugins: [
        remarkMath,
        mdxMermaid,
        remarkGfm,
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: "frontmatter" }],
      ],
      rehypePlugins: [
        [rehypeHighlight, { ignoreMissing: true, subset: false }],
        rehypeMathjax,
      ],
    }),
    reactRouter(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    babel({
      filter: /\.[jt]sx?$/,
      exclude: /node_modules/,
      babelConfig: {
        presets: ["@babel/preset-typescript"],
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "recharts",
      "lucide-react",
      "@mdx-js/rollup",
      "@mdx-js/react",
      "remark-math",
      "mdx-mermaid",
      "remark-gfm",
      "remark-frontmatter",
      "remark-mdx-frontmatter",
      "rehype-highlight",
      "rehype-mathjax",
      "react-virtuoso",
      "date-fns",
      "qrcode.react",
    ],
  },
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: "react", test: /\/(react)($|\/)/ },
            { name: "react-dom", test: /\/(react-dom)($|\/)/ },
            { name: "recharts", test: /\/(recharts)($|\/)/ },
            { name: "lucide-react", test: /\/(lucide-react)($|\/)/ },
            {
              name: "mdx",
              test: /\/(@mdx-js\/react|@mdx-js\/mdx)($|\/)/,
            },
            {
              name: "mdx-plugins",
              test: /\/(rehype-highlight|rehype-mathjax|remark-gfm|remark-math|remark-frontmatter|remark-mdx-frontmatter)($|\/)/,
            },
            {
              name: "virtualized",
              test: /\/(react-virtuoso)($|\/)/,
            },
            {
              name: "date-fns",
              test: /\/(date-fns)($|\/)/,
            },
            {
              name: "qrcode.react",
              test: /\/(qrcode.react)($|\/)/,
            },
          ],
        },
      },
    },
  },
}));
