import type { TranslationFunctionType } from "~/lib/i18n/utils/translations";

import type { Icon } from "../types/type";

import { formatTimeAgo } from "~/lib/i18n/format/time";

export function getRecentActivity(
  t: TranslationFunctionType,
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
      time: formatTimeAgo(t, twoHoursAgo),
      icon: "User" as Icon,
    },
    {
      id: 2,
      actionKey: "dashboard.recentActivity.types.settingsChanged",
      time: formatTimeAgo(t, oneDayAgo),
      icon: "Settings" as Icon,
    },
    {
      id: 3,
      actionKey: "dashboard.recentActivity.types.accountCreated",
      time: formatTimeAgo(t, accountCreatedDate),
      icon: "Calendar" as Icon,
    },
  ];
}
