import { Shield } from "lucide-react";

import type { FC } from "react";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useTranslation } from "~/lib/i18n/context";

interface User {
  name: string;
  role: "admin" | "user";
}

interface WelcomeSectionProps {
  user: User;
}

export const WelcomeSection: FC<WelcomeSectionProps> = ({ user }) => {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/30">
      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 border-4 border-white dark:border-gray-800 shadow-xl ring-2 ring-blue-100 dark:ring-blue-800/50">
        <AvatarFallback className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold truncate bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 dark:from-gray-100 dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent">
          {t("dashboard.welcome.title", { name: user.name })}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base lg:text-lg">
          {t("dashboard.welcome.subtitle")}
        </p>
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <Badge
          variant={user.role === "admin" ? "default" : "secondary"}
          className={`capitalize text-xs sm:text-sm px-3 py-1 font-medium border-0 ${
            user.role === "admin"
              ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg"
              : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg"
          }`}
        >
          <Shield className="w-3 h-3 mr-1.5" />
          {user.role}
        </Badge>
      </div>
    </div>
  );
};
