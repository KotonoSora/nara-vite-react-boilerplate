import type { JSX } from "react";

import type { BlogFrontmatter } from "~/features/blog/utils/mdx-loader";

export type BlogPageContextType = {
  title: string;
  description: string;
};

export type SlugBlogLoaderData = {
  content: JSX.Element;
  frontmatter: BlogFrontmatter;
  slug: string;
};
