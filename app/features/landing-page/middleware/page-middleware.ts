import type { MiddlewareFunction } from "react-router";

import type { LandingPageEnv, PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

import { getFeaturesConfigs } from "../utils/get-features-configs";
import { getPageInformation } from "../utils/get-page-information";
import { getShowcases } from "../utils/get-showcases";
import { getSteps } from "../utils/get-steps";

export const { pageMiddlewareContext } =
  createMiddlewareContext<PageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { db } = context;
  const { t } = context.get(I18nContext);

  // Get page information from environment
  const env = import.meta.env as LandingPageEnv | undefined;
  if (!env) {
    // Optionally, handle missing env more gracefully
    context.set(pageMiddlewareContext, {
      title: "",
      description: "",
      githubRepository: "",
      commercialLink: "",
      showcases: [],
      steps: [],
      featuresConfig: [],
    });

    return await next();
  }
  const pageInformation = getPageInformation(env);

  // Prepare data in parallel if needed
  const showcases = await getShowcases(db);

  // Build context object
  const contextValue: PageInformation = {
    title: pageInformation.title,
    description: pageInformation.description,
    githubRepository: pageInformation.githubRepository,
    commercialLink: pageInformation.commercialLink,
    showcases,
    steps: getSteps(t),
    featuresConfig: getFeaturesConfigs(t),
  };

  context.set(pageMiddlewareContext, contextValue);
};
