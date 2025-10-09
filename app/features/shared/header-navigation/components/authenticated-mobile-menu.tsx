import type { AuthenticatedMobileMenuProps } from "../types/type";

import { useI18n } from "~/lib/i18n/context";

import { DashboardLink } from "./dashboard-link";
import { NavigationActions } from "./navigation-actions";

export function AuthenticatedMobileMenu({
  userName,
  userEmail,
  onNavigate,
}: AuthenticatedMobileMenuProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <DashboardLink
        userName={userName}
        userEmail={userEmail}
        onNavigate={onNavigate}
      />
      <NavigationActions onNavigate={onNavigate} />
    </div>
  );
}
