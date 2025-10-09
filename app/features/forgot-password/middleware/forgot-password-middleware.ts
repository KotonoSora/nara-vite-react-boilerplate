import type { MiddlewareFunction } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/config";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

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
  const { language, t } = context.get(I18nContext);
  const contextValue: ForgotPasswordPageContextType = {
    title: t("auth.forgotPassword.title"),
    description: t("auth.forgotPassword.description"),
    language,
  };
  context.set(forgotPasswordMiddlewareContext, contextValue);
};
