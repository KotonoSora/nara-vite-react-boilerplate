import { data, redirect } from "react-router";

import type { Activity, Stats } from "~/features/dashboard/types/type";
import type { Route } from "./+types/($lang).dashboard";

import { PageContext } from "~/features/dashboard/context/page-context";
import { ContentDashboardPage } from "~/features/dashboard/page";
import { getRecentActivity } from "~/features/dashboard/utils/get-recent-activity";
import { getStats } from "~/features/dashboard/utils/get-stats";
import { getUserId } from "~/lib/auth/auth.server";
import { getUserById } from "~/lib/auth/user.server";
import { createTranslationFunction } from "~/lib/i18n";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const { db } = context;
    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    const userId = await getUserId(request);
    if (!userId) {
      return redirect("/");
    }
    const user = await getUserById(db, userId);
    if (!user) {
      return redirect("/");
    }
    const recentActivity: Activity[] = getRecentActivity(t, user.createdAt);
    const stats: Stats = getStats(user.createdAt);

    return {
      title: t("dashboard.meta.title"),
      description: t("dashboard.meta.description"),
      user,
      recentActivity,
      stats,
    };
  } catch (error) {
    console.error("Dashboard page error:", error);

    return data({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (
    !("title" in loaderData) ||
    !("description" in loaderData) ||
    !loaderData.title ||
    !loaderData.description
  ) {
    return [
      { title: "Dashboard" },
      { name: "description", content: "Your personal dashboard" },
    ];
  }

  return [
    { title: loaderData.title },
    { name: "description", content: loaderData.description },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if (!loaderData || "error" in loaderData) return null;

  const { user, recentActivity, stats } = loaderData;

  return (
    <PageContext.Provider value={{ user, recentActivity, stats }}>
      <ContentDashboardPage />
    </PageContext.Provider>
  );
}
