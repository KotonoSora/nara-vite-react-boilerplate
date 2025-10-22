import type { MiddlewareFunction } from "react-router";

import type { RegisterPageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { pageMiddlewareContext } =
  createMiddlewareContext<RegisterPageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { t } = context.get(I18nContext);
  context.set(pageMiddlewareContext, {
    title: t("auth.register.title"),
    description: t("auth.register.description"),
  });
};
