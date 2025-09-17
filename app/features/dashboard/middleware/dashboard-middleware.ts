import type { SupportedLanguage } from "~/lib/i18n";
import type { MiddlewareFunction } from "react-router";

import { getRecentActivity } from "~/features/dashboard/utils/get-recent-activity";
import { getStats } from "~/features/dashboard/utils/get-stats";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export type DashboardPageContextType = {
  title: string;
  description: string;
  language: SupportedLanguage;
  user: any;
  recentActivity: any;
  stats: any;
};

export const { dashboardMiddlewareContext } =
  createMiddlewareContext<DashboardPageContextType>(
    "dashboardMiddlewareContext",
  );

export const dashboardMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { db } = context;
  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);
  const { getUserId } = await import("~/lib/auth/auth.server");
  const userId = await getUserId(request);
  if (!userId) {
    return Response.redirect("/", 302);
  }
  const { getUserById } = await import("~/lib/auth/user.server");
  const user = await getUserById(db, userId);
  if (!user) {
    return Response.redirect("/", 302);
  }
  const recentActivity = getRecentActivity(t, user.createdAt);
  const stats = getStats(user.createdAt);
  const contextValue: DashboardPageContextType = {
    title: t("dashboard.meta.title"),
    description: t("dashboard.meta.description"),
    language,
    user,
    recentActivity,
    stats,
  };
  context.set(dashboardMiddlewareContext, contextValue);
  return next();
};
