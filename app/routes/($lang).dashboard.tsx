import { redirect } from "react-router";

import type { Route } from "./+types/($lang).dashboard";

import { logout, requireUserId } from "~/auth.server";
import { PageContext } from "~/features/dashboard/context/page-context";
import { ContentDashboardPage } from "~/features/dashboard/page";
import { resolveRequestLanguage } from "~/lib/i18n/request-language.server";
import { formatTimeAgo } from "~/lib/i18n/time-format";
import { createTranslationFunction } from "~/lib/i18n/translations";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  const language = await resolveRequestLanguage(request);
  const t = createTranslationFunction(language);

  const user = await getUserById(db, userId);

  if (!user) {
    return logout(request);
  }

  // Calculate some basic stats
  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Create timestamps for mock activity data
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const accountCreatedDate = new Date(user.createdAt);

  // Mock some activity data - in real app, you'd query from your database
  const recentActivity: Array<{
    id: number;
    actionKey: string;
    time: string;
    timeValue?: number;
    icon: "User" | "Settings" | "Calendar";
  }> = [
    {
      id: 1,
      actionKey: "dashboard.recentActivity.types.profileUpdated",
      time: formatTimeAgo(t, twoHoursAgo),
      icon: "User",
    },
    {
      id: 2,
      actionKey: "dashboard.recentActivity.types.settingsChanged",
      time: formatTimeAgo(t, oneDayAgo),
      icon: "Settings",
    },
    {
      id: 3,
      actionKey: "dashboard.recentActivity.types.accountCreated",
      time: formatTimeAgo(t, accountCreatedDate),
      icon: "Calendar",
    },
  ];

  const stats = {
    daysActive: daysSinceJoined,
    totalLogins: Math.floor(Math.random() * 50) + 10, // Mock data
    profileViews: Math.floor(Math.random() * 100) + 25, // Mock data
  };

  return {
    user,
    recentActivity,
    stats,
    dashboardTitle: (t as any)("dashboard.meta.title"),
    dashboardDescription: (t as any)("dashboard.meta.description"),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  if (!loaderData) {
    return [
      { title: "Dashboard - NARA" },
      { name: "description", content: "Your personal dashboard" },
    ];
  }

  return [
    { title: `${(loaderData as any).dashboardTitle} - NARA` },
    { name: "description", content: (loaderData as any).dashboardDescription },
  ];
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  if (!loaderData) return null;

  return (
    <PageContext.Provider value={loaderData}>
      <ContentDashboardPage />
    </PageContext.Provider>
  );
}
