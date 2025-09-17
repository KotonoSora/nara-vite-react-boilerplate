import { redirect } from "react-router";

import type { SupportedLanguage } from "~/lib/i18n";
import type { MiddlewareFunction } from "react-router";
import type { PageInformation } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export const { pageMiddlewareContext } =
  createMiddlewareContext<PageInformation>("pageMiddlewareContext");

export const pageMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { getUserId } = await import("~/lib/auth/auth.server");

  // Redirect if already logged in
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/dashboard");
  }

  const language: SupportedLanguage = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  context.set(pageMiddlewareContext, {
    title: t("auth.login.title"),
    description: t("auth.login.description"),
    language,
  });

  return await next();
};
