import type { MiddlewareFunction } from "react-router";

import type { ResetPasswordPageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { pageMiddlewareContext } =
  createMiddlewareContext<ResetPasswordPageInformation>(
    "pageMiddlewareContext",
  );

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);

  context.set(pageMiddlewareContext, {
    title: t("auth.resetPassword.title"),
    description: t("auth.resetPassword.description"),
  });

  return await next();
};
