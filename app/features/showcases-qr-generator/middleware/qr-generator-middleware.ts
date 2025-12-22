import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nReactRouterContext } from "~/middleware/i18n";

export const { qrGeneratorMiddlewareContext } =
  createMiddlewareContext<PageInformation>("qrGeneratorMiddlewareContext");

export const qrGeneratorMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);

  const contextValue = {
    title: t("qrGenerator.title"),
    description: t("qrGenerator.description"),
  };

  context.set(qrGeneratorMiddlewareContext, contextValue);

  return await next();
};
