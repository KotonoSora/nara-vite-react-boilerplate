import { Activity } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "~/lib/i18n";

export function SystemStatusCard() {
  const t = useTranslation();

  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
          {t("dashboard.systemStatus.title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("dashboard.systemStatus.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            Authentication
          </span>
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-md text-xs sm:text-sm px-2 py-1">
            {t("dashboard.systemStatus.status.operational")}
          </Badge>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            Database
          </span>
          <Badge className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0 shadow-md text-xs sm:text-sm px-2 py-1">
            Connected
          </Badge>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.systemStatus.responseTime")}
          </span>
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
            ~24ms
          </span>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.systemStatus.uptime")}
          </span>
          <span className="text-sm sm:text-base text-emerald-600 dark:text-emerald-400 font-semibold">
            99.9%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
