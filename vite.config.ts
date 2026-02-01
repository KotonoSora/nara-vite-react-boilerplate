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
}));
