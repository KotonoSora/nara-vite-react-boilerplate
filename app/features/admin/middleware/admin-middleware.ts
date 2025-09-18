import { redirect } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n/config";
import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";

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
  const { db } = context;
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const { getUserId } = await import("~/lib/auth/auth.server");
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/");
  }
  const { getUserById } = await import("~/lib/auth/user.server");
  const user = await getUserById(db, userId);
  if (!user || user.role !== "admin") {
    throw redirect("/");
  }
  const contextValue: AdminPageContextType = {
    title: t("admin.meta.title"),
    description: t("admin.meta.description"),
    language,
    user,
  };
  context.set(adminMiddlewareContext, contextValue);
  return next();
};
