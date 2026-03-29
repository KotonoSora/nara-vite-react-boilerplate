import { useTranslation } from "@kotonosora/i18n-react";
import { Avatar, AvatarFallback } from "@kotonosora/ui/components/ui/avatar";
import { Link } from "react-router";

import type { AuthenticatedMenuProps } from "../types/type";

import { getUserInitial } from "../utils/get-user-initial";

export function UserProfile({
  userName,
  userEmail,
  onClose,
}: AuthenticatedMenuProps) {
  const t = useTranslation();
  const userInitial = getUserInitial(userName);

  return (
    <Link
      to="/dashboard"
      onClick={onClose}
      aria-label={t("navigation.dashboard")}
      discover="none"
    >
      <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
        <Avatar>
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium line-clamp-1">{userName}</div>
          <div className="text-xs text-muted-foreground">{userEmail}</div>
        </div>
      </div>
    </Link>
  );
}
