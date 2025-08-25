import { Settings, Shield, TrendingUp, User } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useTranslation } from "~/lib/i18n";

import { usePageContext } from "../context/page-context";

export function QuickActionsCard() {
  const { user } = usePageContext() || {};
  const t = useTranslation();

  if (!user) return null;

  return (
    <Card className="lg:col-span-1 transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {t("dashboard.quickActions.title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("dashboard.quickActions.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start transition-all hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/50 dark:hover:border-blue-800 group"
          asChild
        >
          <Link to="/profile">
            <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base font-medium">
              {t("dashboard.quickActions.actions.editProfile")}
            </span>
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start transition-all hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-950/50 dark:hover:border-purple-800 group"
          asChild
        >
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400 group-hover:rotate-180 transition-transform" />
            <span className="text-sm sm:text-base font-medium">
              {t("dashboard.quickActions.actions.settings")}
            </span>
          </Link>
        </Button>
        {user.role === "admin" && (
          <Button
            variant="outline"
            className="w-full justify-start transition-all hover:bg-amber-50 hover:border-amber-200 dark:hover:bg-amber-950/50 dark:hover:border-amber-800 group"
            asChild
          >
            <Link to="/admin">
              <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base font-medium">
                {t("dashboard.quickActions.actions.adminPanel")}
              </span>
            </Link>
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full justify-start transition-all hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950/50 dark:hover:border-green-800 group"
          asChild
        >
          <Link to="/showcase">
            <TrendingUp className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base font-medium">
              {t("dashboard.quickActions.actions.viewAnalytics")}
            </span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
