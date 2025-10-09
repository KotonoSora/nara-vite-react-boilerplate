import type { MiddlewareFunction } from "react-router";

import type { AboutPageContextType } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { aboutMiddlewareContext } =
  createMiddlewareContext<AboutPageContextType>("aboutMiddlewareContext");

export const aboutMiddleware: MiddlewareFunction = async ({ context }) => {
  const { language, t } = context.get(I18nContext);

  const contextValue: AboutPageContextType = {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    language,
  };

  context.set(aboutMiddlewareContext, contextValue);
};
