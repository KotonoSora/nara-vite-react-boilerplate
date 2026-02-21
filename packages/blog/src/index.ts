export type { BlogFrontmatter, MDXModule, BlogPost } from "./types/mdx";

export { getAllBlogPosts } from "./utils/get-all-blog-posts";

export { BlogError } from "./components/blog-error";
export { SlugHydrateFallback } from "./components/slug-hydrate-fallback";
export { SlugPage } from "./components/slug-page";
export { mdxComponents } from "./config/mdx-components";
export { loadBlogPost } from "./utils/load-blog-post";
export { HomePage } from "./components/home-page";

// MDX configuration
export { configureMdxModules, getMdxModules } from "./utils/mdx-loader";

// Standard paths and config helpers
export {
  BLOG_CONTENT_PATHS,
  CONTENT_BASE_PATHS,
  BLOG_FILE_EXTENSIONS,
  getStandardBlogPaths,
  createBlogModulesConfig,
} from "./config/paths";
