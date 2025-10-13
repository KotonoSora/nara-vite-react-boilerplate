import type { MiddlewareFunction } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/config";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export type TermsPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
};

export const { termsMiddlewareContext } =
  createMiddlewareContext<TermsPageContextType>("termsMiddlewareContext");

export const termsMiddleware: MiddlewareFunction = async ({ context }) => {
  const { language, t } = context.get(I18nContext);
  const title = t("legal.terms.title");
  const description = t("legal.terms.description");

  const contextValue: TermsPageContextType = {
    title,
    description,
    language,
  };

  context.set(termsMiddlewareContext, contextValue);
};
