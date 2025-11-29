import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import { getRecentActivity } from "~/features/dashboard/utils/get-recent-activity";
import { getStats } from "~/features/dashboard/utils/get-stats";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { AuthContext } from "~/middleware/auth";
import { I18nContext } from "~/middleware/i18n";

export type DashboardPageContextType = {
  title: string;
  description: string;
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
  const { language, t } = context.get(I18nContext);
  const { user } = context.get(AuthContext);
  if (!user) throw redirect("/");
  const recentActivity = getRecentActivity(language, user.createdAt);
  const stats = getStats(user.createdAt);
  const contextValue = {
    title: t("dashboard.meta.title"),
    description: t("dashboard.meta.description"),
    language,
    user,
    recentActivity,
    stats,
  };

  context.set(dashboardMiddlewareContext, contextValue);

  return await next();
};
