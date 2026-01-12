import { formatTimeAgo } from "@kotonosora/i18n";

import type { SupportedLanguage } from "@kotonosora/i18n";

import type { Icon } from "../types/type";

export function getRecentActivity(
  language: SupportedLanguage,
  createdAt: string | Date,
) {
  // Create timestamps for mock activity data
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const accountCreatedDate = new Date(createdAt);

  return [
    {
      id: 1,
      actionKey: "dashboard.recentActivity.types.profileUpdated",
      time: formatTimeAgo(twoHoursAgo, language),
      icon: "User" as Icon,
    },
    {
      id: 2,
      actionKey: "dashboard.recentActivity.types.settingsChanged",
      time: formatTimeAgo(oneDayAgo, language),
      icon: "Settings" as Icon,
    },
    {
      id: 3,
      actionKey: "dashboard.recentActivity.types.accountCreated",
      time: formatTimeAgo(accountCreatedDate, language),
      icon: "Calendar" as Icon,
    },
  ];
}
