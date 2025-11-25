import type { MiddlewareFunction } from "react-router";

import type { PrivacyPageProps } from "../types/type";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { privacyMiddlewareContext } =
  createMiddlewareContext<PrivacyPageProps>("privacyMiddlewareContext");

export const privacyMiddleware: MiddlewareFunction = async (
  { context },
  next,
) => {
  const { t } = context.get(I18nContext);

  const title = t("legal.privacy.title");
  const description = t("legal.privacy.description");

  context.set(privacyMiddlewareContext, {
    title,
    description,
  });

  return await next();
};
