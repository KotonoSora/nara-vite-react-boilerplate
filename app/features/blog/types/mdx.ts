import type { ComponentType } from "react";

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
};
