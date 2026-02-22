import type { BlogFrontmatter, BlogPost } from "@kotonosora/blog";
import type { JSX } from "react";

export type BlogPageContextType = {
  title: string;
  description: string;
};

export type SlugBlogContext = {
  frontmatter: BlogFrontmatter;
  slug: string;
  modulePath?: string;
  loading?: LoadingState;
};

export type LoadingState = {
  isLoading: boolean;
  loaded: number;
  total: number;
  currentSlug?: string;
};

export type AllBlogContext = {
  posts: BlogPost[];
  loading?: LoadingState;
};
