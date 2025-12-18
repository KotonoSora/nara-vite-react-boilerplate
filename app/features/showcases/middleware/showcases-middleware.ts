import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { getBuiltInDemos } from "~/features/landing-page/utils/get-built-in-demos";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { showcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("showcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t, language } = context.get(I18nContext);

  const { db } = context;

  const { getShowcases } =
    await import("~/features/landing-page/utils/get-showcases");
  const showcases = getShowcases(db);

  const contextValue = {
    language,
    commercialLink: "",
    showcases,
    builtInDemos: getBuiltInDemos(t),
  };

  context.set(showcasesMiddlewareContext, contextValue);

  return await next();
};
