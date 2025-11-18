export { mdxComponents } from "./config/mdx-components";

export { BlogPostCard } from "./components/blog-post-card";
export { BlogError } from "./components/blog-error";
export { HomePage } from "./components/home-page";
export { SlugPage } from "./components/slug-page";
export { SlugHydrateFallback } from "./components/slug-hydrate-fallback";

export {
  loadBlogPost,
  getAllBlogPosts,
  getBlogPostsMetadata,
  type BlogPost,
  type BlogFrontmatter,
  type MDXModule,
} from "./utils/mdx-loader";

export {
  searchPosts,
  filterPostsByTag,
  filterPostsByAuthor,
  getAllTags,
  getAllAuthors,
  sortPostsByDate,
  sortPostsByTitle,
} from "./utils/search-posts";

export {
  formatDate,
  formatDateShort,
  getRelativeTime,
} from "./utils/format-date";

export {
  slugBlogMiddleware,
  slugBlogMiddlewareContext,
} from "./middleware/slug-blog-middleware";

export {
  blogMiddleware,
  blogMiddlewareContext,
} from "./middleware/blog-middleware";

export type { BlogPageContextType, SlugBlogLoaderData } from "./types/type";
