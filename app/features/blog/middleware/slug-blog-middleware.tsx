import { MDXProvider } from "@mdx-js/react";
import { data } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { SlugBlogContext } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

import { mdxComponents } from "../config/mdx-components";
import { loadBlogPost } from "../utils/load-blog-post";

export const { SlugBlogReactRouterContext } =
  createMiddlewareContext<SlugBlogContext>("SlugBlogReactRouterContext");

export const slugBlogMiddleware: MiddlewareFunction = async (
  { context, params },
  next,
) => {
  const slug = params["*"] as string;

  if (!slug) {
    throw data({ error: "Slug parameter is required" }, { status: 400 });
  }

  const post = await loadBlogPost(slug);

  if (!post) {
    throw data({ error: "Blog post not found" }, { status: 404 });
  }

  const MDXContent = post.content;

  const contextValue: SlugBlogContext = {
    slug: post.slug,
    frontmatter: post.frontmatter,
    content: (
      <MDXProvider components={mdxComponents}>
        <MDXContent />
      </MDXProvider>
    ),
  };

  context.set(SlugBlogReactRouterContext, contextValue);

  return await next();
};
