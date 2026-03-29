import { getAllBlogPosts } from "@kotonosora/blog";

import type { MiddlewareFunction } from "react-router";

import type { AllBlogContext, LoadingState } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

export const { AllBlogReactRouterContext } =
  createMiddlewareContext<AllBlogContext>("AllBlogReactRouterContext");

export const allBlogMiddleware: MiddlewareFunction = async (
  { context, params },
  next,
) => {
  const loadingState: LoadingState = {
    isLoading: true,
    loaded: 0,
    total: 0,
  };

  const posts = await getAllBlogPosts((progress) => {
    loadingState.loaded = progress.loaded;
    loadingState.total = progress.total;
    loadingState.currentSlug = progress.currentSlug;
  });

  loadingState.isLoading = false;

  context.set(AllBlogReactRouterContext, { posts, loading: loadingState });

  return await next();
};
