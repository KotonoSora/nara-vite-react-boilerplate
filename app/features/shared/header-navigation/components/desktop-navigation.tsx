import type { NavigationProps } from "../types/type";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { useOptionalAuth } from "~/lib/auth/context";
import { useI18n } from "~/lib/i18n/context";

import { GitHubButton } from "../../components/github-button";
import { AuthenticatedMenu } from "./authenticated-menu";
import { GuestMenu } from "./guest-menu";

export function DesktopNavigation({ onNavigate }: NavigationProps) {
  const auth = useOptionalAuth();
  const { t } = useI18n();
  const isAuthenticated = auth?.isAuthenticated;

  return (
    <nav
      className="hidden md:flex items-center space-x-3"
      aria-label={t("navigation.menu")}
    >
      {isAuthenticated ? (
        <AuthenticatedMenu userName={auth.user?.name} onNavigate={onNavigate} />
      ) : (
        <GuestMenu />
      )}

      <GitHubButton />
      <LanguageSwitcher />
      <ModeSwitcher />
    </nav>
  );
}
