import { useTranslation } from "@kotonosora/i18n-react";
import { Activity, TrendingUp } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function AuthDemoCard() {
  const t = useTranslation();

  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-linear-to-br from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("dashboard.authDemo.title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("dashboard.authDemo.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-5">
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
          {t("dashboard.authDemo.content")}
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 pl-2">
          <li>{t("dashboard.authDemo.features.secureAuth")}</li>
          <li>{t("dashboard.authDemo.features.userDatabase")}</li>
          <li>{t("dashboard.authDemo.features.roleBasedAccess")}</li>
          <li>{t("dashboard.authDemo.features.sessionManagement")}</li>
          <li>{t("dashboard.authDemo.features.activityTracking")}</li>
          <li>{t("dashboard.authDemo.features.statisticsCalculation")}</li>
        </ul>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="transition-all hover:bg-violet-50 hover:border-violet-200 dark:hover:bg-violet-950/50 dark:hover:border-violet-800 group"
            asChild
          >
            <Link to="/">
              <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-medium">
                {t("dashboard.authDemo.actions.home")}
              </span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="transition-all hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950/50 dark:hover:border-purple-800 group"
            asChild
          >
            <Link to="/showcase">
              <Activity className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-medium">
                {t("dashboard.authDemo.actions.learnMore")}
              </span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
