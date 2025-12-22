import type { MiddlewareFunction } from "react-router";

import type { BlogPageContextType } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { blogMiddlewareContext } =
  createMiddlewareContext<BlogPageContextType>("blogMiddlewareContext");

export const blogMiddleware: MiddlewareFunction = async ({ context }, next) => {
  const { t } = context.get(I18nReactRouterContext);

  const contextValue: BlogPageContextType = {
    title: t("blog.meta.title"),
    description: t("blog.meta.description"),
  };

  context.set(blogMiddlewareContext, contextValue);

  return await next();
};
