import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { showcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("showcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { language } = context.get(I18nContext);

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
};
