import type { MiddlewareFunction } from "react-router";
import type { PageInformation } from "../types/type";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export const { showcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("showcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const { db } = context;
  const { title, description, githubRepository } = getPageInformation(
    import.meta.env as any,
  );
  const showcases = await getShowcases(db);

  const contextValue = {
    title,
    description,
    language,
    githubRepository,
    commercialLink: "",
    showcases,
  };

  context.set(showcasesMiddlewareContext, contextValue);
  return next();
};
