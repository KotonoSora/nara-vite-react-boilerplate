import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export type ForgotPasswordPageContextType = {
  title: string;
  description: string;
};

export const { forgotPasswordMiddlewareContext } =
  createMiddlewareContext<ForgotPasswordPageContextType>(
    "forgotPasswordMiddlewareContext",
  );

export const forgotPasswordMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { t } = context.get(I18nContext);
  const contextValue: ForgotPasswordPageContextType = {
    title: t("auth.forgotPassword.title"),
    description: t("auth.forgotPassword.description"),
  };

  context.set(forgotPasswordMiddlewareContext, contextValue);

  return await next();
};
