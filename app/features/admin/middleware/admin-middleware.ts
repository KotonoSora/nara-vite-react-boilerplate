import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/types/common";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { AuthContext } from "~/middleware/auth";
import { I18nContext } from "~/middleware/i18n";

export type AdminPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
  user: any;
};

export const { adminMiddlewareContext } =
  createMiddlewareContext<AdminPageContextType>("adminMiddlewareContext");

export const adminMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { language, t } = context.get(I18nContext);
  const { user } = context.get(AuthContext);
  if (!user || user.role !== "admin") throw redirect("/");
  const contextValue = {
    title: t("admin.meta.title"),
    description: t("admin.meta.description"),
    language,
    user,
  };
  context.set(adminMiddlewareContext, contextValue);
};
