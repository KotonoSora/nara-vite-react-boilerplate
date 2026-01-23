import type { MiddlewareFunction } from "react-router";

import type { LandingPageContextType } from "../types/type";

import { fetchShowcases } from "~/features/landing-page/utils/fetch-showcases";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

import { getBuiltInDemos } from "../utils/get-built-in-demos";
import { getFeaturesConfigs } from "../utils/get-features-configs";
import { getSteps } from "../utils/get-steps";

export const { LandingPageReactRouterContext } =
  createMiddlewareContext<LandingPageContextType>(
    "LandingPageReactRouterContext",
  );

export const landingPageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { db } = context;

  let t;
  try {
    t = context.get(I18nReactRouterContext).t;
  } catch {
    const { resolveRequestLanguage } =
      await import("~/lib/i18n/server/request-language.server");
    const { loadDataTranslations } =
      await import("~/lib/i18n/server/load-data-translations.server");
    const { createTranslationFunctionWithData } =
      await import("@kotonosora/i18n");

    const language = await resolveRequestLanguage(request);
    const translations = await loadDataTranslations(language);
    t = createTranslationFunctionWithData(translations, language);

    // Make the i18n context available for downstream middleware/handlers
    context.set(I18nReactRouterContext, { language, t });
  }

  // Prepare showcases: published, non-deleted, page 1 size 4, ordered by publishedAt desc, score > 0
  const showcases = fetchShowcases(db, {
    page: 1,
    pageSize: 4,
    sortBy: "publishedAt",
    sortDir: "desc",
    published: "true",
    deleted: "false",
    minScore: 0,
  });

  // Build context object
  const contextValue: LandingPageContextType = {
    showcases,
    builtInDemos: getBuiltInDemos(t),
    steps: getSteps(t),
    featuresConfig: getFeaturesConfigs(t),
  };

  context.set(LandingPageReactRouterContext, contextValue);

  return await next();
};
