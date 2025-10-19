import { Calendar, Clock, Settings, User } from "lucide-react";
import { useLoaderData } from "react-router";

import type { DashboardContentProps } from "../types/type";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTranslation } from "~/lib/i18n/hooks/common";

export function RecentActivityCard() {
  const { recentActivity } = useLoaderData<DashboardContentProps>();
  const t = useTranslation();

  if (!recentActivity) return null;

  return (
    <Card className="lg:col-span-1 transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
          {t("dashboard.recentActivity.title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("dashboard.recentActivity.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        {recentActivity.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            {t("dashboard.recentActivity.noActivity")}
          </div>
        ) : (
          recentActivity.map((activity) => {
            const IconComponent =
              activity.icon === "User"
                ? User
                : activity.icon === "Settings"
                  ? Settings
                  : Calendar;
            const iconColors = {
              User: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
              Settings:
                "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50",
              Calendar:
                "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50",
            };
            return (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full shrink-0 ${iconColors[activity.icon]}`}
                >
                  <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium truncate text-gray-900 dark:text-gray-100">
                    {(t as any)(activity.actionKey)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
