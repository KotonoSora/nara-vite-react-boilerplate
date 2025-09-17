import type { MiddlewareFunction } from "react-router";
import type { PrivacyPageProps } from "../types/type";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export const { privacyMiddlewareContext } =
  createMiddlewareContext<PrivacyPageProps>("privacyMiddlewareContext");

export const privacyMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  // Resolve language and translation function
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const title = t("legal.privacy.title");
  const description = t("legal.privacy.description");

  const { githubRepository } = getPageInformation(import.meta.env as any);

  context.set(privacyMiddlewareContext, {
    title,
    description,
    githubRepository,
  });

  return await next();
};
