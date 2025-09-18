import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

export type TermsPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
  githubRepository?: string;
};

export const { termsMiddlewareContext } =
  createMiddlewareContext<TermsPageContextType>("termsMiddlewareContext");

export const termsMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const title = t("legal.terms.title");
  const description = t("legal.terms.description");

  const { githubRepository } =
    (await getPageInformation(import.meta.env as any)) || {};

  const contextValue: TermsPageContextType = {
    title,
    description,
    language,
    githubRepository,
  };

  context.set(termsMiddlewareContext, contextValue);
  return next();
};
