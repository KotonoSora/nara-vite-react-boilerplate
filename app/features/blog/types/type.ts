import type { BlogFrontmatter, BlogPost } from "@kotonosora/blog";
import type { JSX } from "react";

export type BlogPageContextType = {
  title: string;
  description: string;
};

export type SlugBlogContext = {
  content: JSX.Element;
  frontmatter: BlogFrontmatter;
  slug: string;
};

export type AllBlogContext = {
  posts: BlogPost[];
};
