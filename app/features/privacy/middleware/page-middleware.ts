import type { MiddlewareFunction } from "react-router";

import type { PrivacyPageProps } from "../types/type";

import { getPageInformation } from "~/features/landing-page/utils/get-page-information";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { I18nContext } from "~/middleware/i18n";

export const { privacyMiddlewareContext } =
  createMiddlewareContext<PrivacyPageProps>("privacyMiddlewareContext");

export const privacyMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { t } = context.get(I18nContext);

  const title = t("legal.privacy.title");
  const description = t("legal.privacy.description");

  const { githubRepository } = getPageInformation(import.meta.env as any);

  context.set(privacyMiddlewareContext, {
    title,
    description,
    githubRepository,
  });
};
