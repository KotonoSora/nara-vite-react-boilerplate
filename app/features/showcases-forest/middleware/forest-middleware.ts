import type { MiddlewareFunction } from "react-router";

import type { ForestPageContextType } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { forestMiddlewareContext } =
  createMiddlewareContext<ForestPageContextType>("forestMiddlewareContext");

export const forestMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);

  const contextValue: ForestPageContextType = {
    title: t("forest.meta.title"),
    description: t("forest.meta.description"),
  };

  context.set(forestMiddlewareContext, contextValue);

  return await next();
};
