import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { getBuiltInDemos } from "~/features/landing-page/utils/get-built-in-demos";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { ShowcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("ShowcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { db } = context;
  const { t } = context.get(I18nReactRouterContext);

  const { getShowcases } =
    await import("~/features/landing-page/utils/get-showcases");
  const showcases = getShowcases(db);

  const contextValue = {
    commercialLink: "",
    showcases,
    builtInDemos: getBuiltInDemos(t),
  };

  context.set(ShowcasesMiddlewareContext, contextValue);

  return await next();
};
