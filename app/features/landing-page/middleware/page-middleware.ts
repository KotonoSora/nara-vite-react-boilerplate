import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

import { getBuiltInDemos } from "../utils/get-built-in-demos";
import { getFeaturesConfigs } from "../utils/get-features-configs";
import { getSteps } from "../utils/get-steps";

export const { pageMiddlewareContext } =
  createMiddlewareContext<PageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async ({ context }, next) => {
  const { db } = context;
  const { t } = context.get(I18nReactRouterContext);

  // Prepare data in parallel if needed
  const { getShowcases } = await import("../utils/get-showcases");
  const showcases = getShowcases(db);

  // Build context object
  const contextValue: PageInformation = {
    showcases,
    builtInDemos: getBuiltInDemos(t),
    steps: getSteps(t),
    featuresConfig: getFeaturesConfigs(t),
  };

  context.set(pageMiddlewareContext, contextValue);

  return await next();
};
