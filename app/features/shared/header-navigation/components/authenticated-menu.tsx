import { Home } from "lucide-react";
import { Link } from "react-router";

import type { AuthenticatedMenuProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

import { LogoutButton } from "./logout-button";
import { UserInitialAvatar } from "./user-initial-avatar";

export function AuthenticatedMenu({
  userName,
  onNavigate,
}: AuthenticatedMenuProps) {
  const { t } = useI18n();
  const userInitial = userName?.charAt(0).toUpperCase();

  return (
    <div className="flex items-center space-x-3">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/about">{t("navigation.about")}</Link>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <Link to="/" title={t("navigation.home")}>
          <Home className="h-4 w-4" />
        </Link>
      </Button>
      <Link
        to="/dashboard"
        onClick={onNavigate}
        aria-label={t("navigation.dashboard")}
      >
        <UserInitialAvatar
          initial={userInitial}
          title={t("navigation.dashboard")}
        />
      </Link>
      <LogoutButton />
    </div>
  );
}
