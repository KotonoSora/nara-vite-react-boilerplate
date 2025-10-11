import type { MiddlewareFunction } from "react-router";

import type { PUBLIC_ENV_FLAG } from "~/features/shared/types/type";

import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

import { getGeneralInformation } from "../../shared/utils/get-general-information";
import { getFeaturesConfigs } from "../utils/get-features-configs";
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
  const env = import.meta.env as PUBLIC_ENV_FLAG | undefined;
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
  const pageInformation = getGeneralInformation(env);

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
