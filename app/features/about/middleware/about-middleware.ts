import type { MiddlewareFunction } from "react-router";

import type { AboutPageContextType } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { aboutMiddlewareContext } =
  createMiddlewareContext<AboutPageContextType>("aboutMiddlewareContext");

export const aboutMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nContext);

  const contextValue: AboutPageContextType = {
    title: t("about.meta.title"),
    description: t("about.meta.description"),
    content: {
      heading: t("about.heading"),
      tagline: t("about.tagline"),
      taglineSecond: t("about.taglineSecond"),
      description: t("about.description"),
      descriptionSecond: t("about.descriptionSecond"),
      contactLabel: t("about.contactLabel"),
      email: import.meta.env.VITE_CONTACT_EMAIL ?? "",
    },
  };

  context.set(aboutMiddlewareContext, contextValue);

  return await next();
};
