import type { SupportedLanguage } from "~/lib/i18n";
import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export type ForgotPasswordPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
};

export const { forgotPasswordMiddlewareContext } =
  createMiddlewareContext<ForgotPasswordPageContextType>(
    "forgotPasswordMiddlewareContext",
  );

export const forgotPasswordMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const contextValue: ForgotPasswordPageContextType = {
    title: t("auth.forgotPassword.title"),
    description: t("auth.forgotPassword.description"),
    language,
  };
  context.set(forgotPasswordMiddlewareContext, contextValue);
  return next();
};
