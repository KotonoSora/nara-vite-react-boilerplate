import { User } from "lucide-react";

import type { FC } from "react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "~/lib/i18n/context";

interface User {
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string | Date;
}

interface UserInfoCardProps {
  user: User;
}

export const UserInfoCard: FC<UserInfoCardProps> = ({ user }) => {
  const t = useTranslation();

  return (
    <Card className="lg:col-span-1 transition-all hover:shadow-lg hover:-translate-y-1 border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          <User className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600 dark:text-slate-400" />
          {t("dashboard.userInfo.title")}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t("dashboard.userInfo.description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.userInfo.fields.name")}
          </span>
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
            {user.name}
          </span>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.userInfo.fields.email")}
          </span>
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
            {user.email}
          </span>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.userInfo.fields.role")}
          </span>
          <Badge
            variant="outline"
            className="capitalize bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300"
          >
            {user.role}
          </Badge>
        </div>
        <Separator className="bg-gray-200 dark:bg-gray-700" />
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
            {t("dashboard.userInfo.fields.memberSince")}
          </span>
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
