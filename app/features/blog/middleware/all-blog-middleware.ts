import type { MiddlewareFunction } from "react-router";

import type { AllBlogContext } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";

import { getAllBlogPosts } from "../utils/get-all-blog-posts";

export const { AllBlogReactRouterContext } =
  createMiddlewareContext<AllBlogContext>("AllBlogReactRouterContext");

export const allBlogMiddleware: MiddlewareFunction = async (
  { context, params },
  next,
) => {
  const posts = await getAllBlogPosts();

  context.set(AllBlogReactRouterContext, { posts });

  return await next();
};
