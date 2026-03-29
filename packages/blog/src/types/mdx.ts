import type { ComponentType, JSX } from "react";

export type BlogFrontmatter = {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  tags?: string[];
  image?: string;
  published?: boolean;
};

export type MDXModule = {
  default: ComponentType;
  frontmatter?: BlogFrontmatter;
};

export type BlogPost = {
  slug: string;
  content: ComponentType;
  frontmatter: BlogFrontmatter;
  url?: string;
};

export type HomePageLoaderData = {
  posts: BlogPost[];
  loading?: {
    isLoading: boolean;
    loaded: number;
    total: number;
    currentSlug?: string;
  };
};

export type BlogPostCardProps = {
  post: BlogPost;
};

export type SlugBlogLoaderData = {
  frontmatter: BlogFrontmatter;
  slug: string;
  modulePath?: string;
  contentComponent?: React.ComponentType<any>;
  loading?: {
    isLoading: boolean;
    loaded: number;
    total: number;
    currentSlug?: string;
  };
};

export type BlogErrorProps = {
  error?: {
    status?: number;
    statusText?: string;
    message?: string;
  };
};
