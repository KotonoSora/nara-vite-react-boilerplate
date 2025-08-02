import type { Route } from "./+types/($lang).dashboard";

import { requireUserId } from "~/auth.server";
import { PageContext } from "~/features/auth/pages/dashboard/context/page-context";
import { ContentDashboardPage } from "~/features/auth/pages/dashboard/page";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  const user = await getUserById(db, userId);

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  // Calculate some basic stats
  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Mock some activity data - in real app, you'd query from your database
  const recentActivity: Array<{
    id: number;
    action: string;
    time: string;
    icon: "User" | "Settings" | "Calendar";
  }> = [
    { id: 1, action: "Profile updated", time: "2 hours ago", icon: "User" },
    { id: 2, action: "Settings changed", time: "1 day ago", icon: "Settings" },
    {
      id: 3,
      action: "Account created",
      time: `${daysSinceJoined} days ago`,
      icon: "Calendar",
    },
  ];

  const stats = {
    daysActive: daysSinceJoined,
    totalLogins: Math.floor(Math.random() * 50) + 10, // Mock data
    profileViews: Math.floor(Math.random() * 100) + 25, // Mock data
  };

  return { user, recentActivity, stats };
}

export function meta(): ReturnType<Route.MetaFunction> {
  return [
    { title: "Dashboard - NARA" },
    { name: "description", content: "Your personal dashboard" },
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
