import { getMdxModulePath, loadBlogPost } from "@kotonosora/blog";
import { data } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { LoadingState, SlugBlogContext } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export const { SlugBlogReactRouterContext } =
  createMiddlewareContext<SlugBlogContext>("SlugBlogReactRouterContext");

export const slugBlogMiddleware: MiddlewareFunction = async (
  { context, params },
  next,
) => {
  const rawSlug = params["*"] as string;

  if (!rawSlug) {
    throw data({ error: "Slug parameter is required" }, { status: 400 });
  }

  // Remove trailing slash from slug
  const slug = rawSlug.replace(/\/$/, "");

  const loadingState: LoadingState = {
    isLoading: true,
    loaded: 0,
    total: 1,
    currentSlug: slug,
  };

  const post = await loadBlogPost(slug);

  if (!post) {
    throw data({ error: "Blog post not found" }, { status: 404 });
  }

  // Get the module path for client-side loading
  const modulePath = getMdxModulePath(slug);

  loadingState.loaded = 1;
  loadingState.isLoading = false;

  const contextValue: SlugBlogContext = {
    slug: post.slug,
    frontmatter: post.frontmatter,
    modulePath,
    loading: loadingState,
  };

  context.set(SlugBlogReactRouterContext, contextValue);

  return await next();
};
