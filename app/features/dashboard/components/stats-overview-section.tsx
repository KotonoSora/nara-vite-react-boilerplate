import { Activity, Calendar, TrendingUp, Users } from "lucide-react";
import { useLoaderData } from "react-router";

import type { DashboardContentProps } from "../types/type";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function StatsOverviewSection() {
  const { stats } = useLoaderData<DashboardContentProps>();
  const t = useTranslation();

  if (!stats) return null;

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.stats.daysActive.title")}
          </CardTitle>
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {stats.daysActive}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("dashboard.stats.daysActive.subtitle")}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.stats.totalLogins.title")}
          </CardTitle>
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {stats.totalLogins}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("dashboard.stats.totalLogins.subtitle")}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.stats.profileViews.title")}
          </CardTitle>
          <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {stats.profileViews}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("dashboard.stats.profileViews.subtitle")}
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.stats.lastLogin.title")}
          </CardTitle>
          <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            Active
          </div>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("dashboard.stats.lastLogin.subtitle")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
