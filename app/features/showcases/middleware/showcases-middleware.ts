import type { MiddlewareFunction } from "react-router";

import type { PageInformation } from "../types/type";

import { getShowcases } from "~/features/landing-page/utils/get-showcases";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { showcasesMiddlewareContext } =
  createMiddlewareContext<PageInformation>("showcasesMiddlewareContext");

export const showcasesMiddleware: MiddlewareFunction = async ({ context }) => {
  const { language } = context.get(I18nContext);

  const { db } = context;
  const showcases = await getShowcases(db);

  const contextValue = {
    language,
    commercialLink: "",
    showcases,
  };

  context.set(showcasesMiddlewareContext, contextValue);
};
