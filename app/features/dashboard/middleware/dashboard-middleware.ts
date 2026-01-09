import { redirect } from "react-router";

import type { MiddlewareFunction } from "react-router";

import type { FetchShowcasesResult } from "~/features/landing-page/utils/fetch-showcases";

import { getRecentActivity } from "~/features/dashboard/utils/get-recent-activity";
import { getStats } from "~/features/dashboard/utils/get-stats";
import { fetchShowcaseTags } from "~/features/landing-page/utils/fetch-showcase-tags";
import { fetchShowcases } from "~/features/landing-page/utils/fetch-showcases";
import { createMiddlewareContext } from "~/features/shared/context/create-middleware-context";
import { AuthContext } from "~/middleware/auth";
import { I18nReactRouterContext } from "~/middleware/i18n";

export type DashboardPageContextType = {
  title: string;
  description: string;
  user: any;
  recentActivity: any;
  stats: any;
  showcases: FetchShowcasesResult;
  availableTags: string[];
};

export const { DashboardMiddlewareContext } =
  createMiddlewareContext<DashboardPageContextType>(
    "DashboardMiddlewareContext",
  );

export const dashboardMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const { db } = context;
  const { language, t } = context.get(I18nReactRouterContext);
  const { user } = context.get(AuthContext);
  if (!user) throw redirect("/");

  const recentActivity = getRecentActivity(language, user.createdAt);
  const stats = getStats(user.createdAt);
  const url = new URL(request.url);
  const pageParam = url.searchParams.get("page");
  const pageSizeParam = url.searchParams.get("pageSize");
  const sortByParam = url.searchParams.get("sortBy");
  const sortDirParam = url.searchParams.get("sortDir");
  const searchParam = url.searchParams.get("search");
  const tagsParam = url.searchParams.getAll("tags");
  const page = Math.max(1, Number(pageParam) || 1);
  const pageSize = Math.max(1, Number(pageSizeParam) || 10);
  const sortBy =
    sortByParam === "name" ||
    sortByParam === "publishedAt" ||
    sortByParam === "createdAt"
      ? sortByParam
      : ("createdAt" as const);
  const sortDir =
    sortDirParam === "asc" || sortDirParam === "desc"
      ? (sortDirParam as "asc" | "desc")
      : ("desc" as const);

  const showcases = await fetchShowcases(db, {
    page,
    pageSize,
    sortBy,
    sortDir,
    search: searchParam || undefined,
    tags: tagsParam.length ? tagsParam : undefined,
    authorId: user.id,
  });

  // Get global available tags for filtering (not limited to current page)
  const tagsResult = await fetchShowcaseTags(db, {
    page: 1,
    pageSize: 10000,
    sortBy: "tag",
    sortDir: "asc",
    deleted: "false",
  });
  const availableTags = Array.from(
    new Set(tagsResult.items.map((t) => t.name)),
  );

  const contextValue = {
    title: t("dashboard.meta.title"),
    description: t("dashboard.meta.description"),
    user,
    recentActivity,
    stats,
    showcases,
    availableTags,
  };

  context.set(DashboardMiddlewareContext, contextValue);

  return await next();
};
