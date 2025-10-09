import { Link } from "react-router";

import type { AuthenticatedMobileMenuProps } from "../types/type";

import { useI18n } from "~/lib/i18n/context";

import { UserInitialAvatar } from "./user-initial-avatar";

export function DashboardLink({
  userName,
  userEmail,
  onNavigate,
}: AuthenticatedMobileMenuProps) {
  const { t } = useI18n();
  const userInitial = userName?.charAt(0).toUpperCase();

  return (
    <Link
      to="/dashboard"
      onClick={onNavigate}
      aria-label={t("navigation.dashboard")}
    >
      <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
        <UserInitialAvatar
          initial={userInitial}
          title={t("navigation.dashboard")}
        />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium line-clamp-1">{userName}</div>
          <div className="text-xs text-muted-foreground">{userEmail}</div>
        </div>
      </div>
    </Link>
  );
}
