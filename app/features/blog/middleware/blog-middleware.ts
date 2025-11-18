import type { MiddlewareFunction } from "react-router";

import type { BlogPageContextType } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { blogMiddlewareContext } =
  createMiddlewareContext<BlogPageContextType>("blogMiddlewareContext");

export const blogMiddleware: MiddlewareFunction = async ({ context }) => {
  const { t } = context.get(I18nContext);

  const contextValue: BlogPageContextType = {
    title: t("blog.meta.title"),
    description: t("blog.meta.description"),
  };

  context.set(blogMiddlewareContext, contextValue);
};
