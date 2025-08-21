import type {
  DashboardLoaderData,
  DashboardStats,
  RecentActivity,
} from "~/features/dashboard/types/types";

import {
  MILLISECONDS_PER_DAY,
  ONE_DAY_MS,
  TWO_HOURS_MS,
} from "~/features/dashboard/constants/common";
import { formatTimeAgo } from "~/lib/i18n/time-format";
import { createTranslationFunction } from "~/lib/i18n/translations";

/**
 * Calculate the number of days since the user joined
 * @param createdAt - The date the user joined
 * @returns The number of days since the user joined
 */
export function calculateDaysSinceJoined(createdAt: string | Date): number {
  return Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / MILLISECONDS_PER_DAY,
  );
}

/**
 * Generate mock statistics for the dashboard
 * @param daysSinceJoined - The number of days since the user joined
 * @returns The mock statistics for the dashboard
 */
export function generateMockStats(daysSinceJoined: number): DashboardStats {
  return {
    daysActive: daysSinceJoined,
    totalLogins: Math.floor(Math.random() * 50) + 10,
    profileViews: Math.floor(Math.random() * 100) + 25,
  };
}

/**
 * Create mock activity for the dashboard
 * @param t - The translation function
 * @param userCreatedAt - The date the user created their account
 * @returns The mock activity for the dashboard
 */
export function createMockActivity(
  t: ReturnType<typeof createTranslationFunction>,
  userCreatedAt: string | Date,
): readonly RecentActivity[] {
  const now = Date.now();
  const twoHoursAgo = new Date(now - TWO_HOURS_MS);
  const oneDayAgo = new Date(now - ONE_DAY_MS);
  const accountCreatedDate = new Date(userCreatedAt);

  return [
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
  ] as const;
}

/**
 * Check if the loader data is valid
 * @param data - The loader data to check
 * @returns True if the loader data is valid, false otherwise
 */
export function isDashboardLoaderData(
  data: unknown,
): data is DashboardLoaderData {
  return (
    data !== null &&
    typeof data === "object" &&
    "user" in data &&
    "recentActivity" in data &&
    "stats" in data &&
    "dashboardTitle" in data &&
    "dashboardDescription" in data
  );
}

/**
 * Check if the loader data has meta fields
 * @param data - The loader data to check
 * @returns True if the loader data has meta fields, false otherwise
 */
export function hasMetaFields(
  data: unknown,
): data is { dashboardTitle: string; dashboardDescription: string } {
  return (
    data !== null &&
    typeof data === "object" &&
    "dashboardTitle" in data &&
    "dashboardDescription" in data &&
    typeof (data as any).dashboardTitle === "string" &&
    typeof (data as any).dashboardDescription === "string"
  );
}
