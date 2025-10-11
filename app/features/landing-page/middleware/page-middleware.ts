import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

import { getFeaturesConfigs } from "../utils/get-features-configs";
import { getShowcases } from "../utils/get-showcases";
import { getSteps } from "../utils/get-steps";

export const { pageMiddlewareContext } =
  createMiddlewareContext<PageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async ({ context }) => {
  const { db } = context;
  const { t } = context.get(I18nContext);

  // Prepare data in parallel if needed
  const showcases = await getShowcases(db);

  // Build context object
  const contextValue: PageInformation = {
    showcases,
    steps: getSteps(t),
    featuresConfig: getFeaturesConfigs(t),
  };

  context.set(pageMiddlewareContext, contextValue);
};
