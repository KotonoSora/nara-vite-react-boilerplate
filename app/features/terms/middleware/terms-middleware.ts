import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export type TermsPageContextType = {
  title: string;
  description: string;
};

export const { termsMiddlewareContext } =
  createMiddlewareContext<TermsPageContextType>("termsMiddlewareContext");

export const termsMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);
  const title = t("legal.terms.title");
  const description = t("legal.terms.description");

  const contextValue: TermsPageContextType = {
    title,
    description,
  };

  context.set(termsMiddlewareContext, contextValue);

  return await next();
};
