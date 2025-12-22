import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { AuthContext } from "~/middleware/auth";
import { I18nReactRouterContext } from "~/middleware/i18n";

export type AdminPageContextType = {
  title: string;
  description: string;
  user: any;
};

export const { adminMiddlewareContext } =
  createMiddlewareContext<AdminPageContextType>("adminMiddlewareContext");

export const adminMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { t } = context.get(I18nReactRouterContext);
  const { user } = context.get(AuthContext);
  if (!user || user.role !== "admin") throw redirect("/");

  const contextValue = {
    title: t("admin.meta.title"),
    description: t("admin.meta.description"),
    user,
  };

  context.set(adminMiddlewareContext, contextValue);

  return await next();
};
