import type { JSX } from "react";

import type { BlogFrontmatter, BlogPost } from "./mdx";

export type BlogPageContextType = {
  title: string;
  description: string;
};

export type SlugBlogLoaderData = {
  content: JSX.Element;
  frontmatter: BlogFrontmatter;
  slug: string;
};

export type SlugBlogContext = {
  content: JSX.Element;
  frontmatter: BlogFrontmatter;
  slug: string;
};

export type BlogErrorProps = {
  error?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
};

export type HomePageLoaderData = {
  posts: BlogPost[];
};

export type AllBlogContext = {
  posts: BlogPost[];
};

export type BlogPostCardProps = {
  post: BlogPost;
};
