import type { Route } from "./+types/($lang).dashboard";

import { getUserId, logout } from "~/auth.server";
import { PageContext } from "~/features/dashboard/context/page-context";
import { ContentDashboardPage } from "~/features/dashboard/page";
import {
  calculateDaysSinceJoined,
  createMockActivity,
  generateMockStats,
  hasMetaFields,
  isDashboardLoaderData,
} from "~/features/dashboard/utils/helper";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  try {
    const language = await resolveRequestLanguage(request);
    const t = createTranslationFunction(language);
    const userId = await getUserId(request);

    if (!userId) {
      return logout(request);
    }

    const { db } = context;
    const user = await getUserById(db, userId);

    if (!user) {
      return logout(request);
    }

    const daysSinceJoined = calculateDaysSinceJoined(user.createdAt);
    const recentActivity = createMockActivity(t, user.createdAt);
    const stats = generateMockStats(daysSinceJoined);

    return {
      user,
      recentActivity,
      stats,
      dashboardTitle: t("dashboard.meta.title"),
      dashboardDescription: t("dashboard.meta.description"),
    };
  } catch (error) {
    console.error("Dashboard loader error:", error);
    return null;
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (hasMetaFields(loaderData)) {
    const { dashboardTitle, dashboardDescription } = loaderData;
    return [
      { title: `${dashboardTitle} - NARA` },
      { name: "description", content: dashboardDescription },
    ];
  }

  return [
    { title: "Dashboard - NARA" },
    { name: "description", content: "Your personal dashboard" },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if (!isDashboardLoaderData(loaderData)) {
    return null;
  }

  const { user, recentActivity, stats } = loaderData;

  return (
    <PageContext.Provider value={{ user, recentActivity, stats }}>
      <ContentDashboardPage />
    </PageContext.Provider>
  );
}
