import { Link } from "react-router";

import type { MobileNavigationProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { useOptionalAuth } from "~/lib/auth/context";
import { useI18n } from "~/lib/i18n/context";
import { cn } from "~/lib/utils";

import { GitHubButton } from "../../components/github-button";
import { MOBILE_NAVIGATION_ID } from "../constants/constants";
import { AuthenticatedMobileMenu } from "./authenticated-mobile-menu";
import { GuestMobileMenu } from "./guest-mobile-menu";

export function MobileNavigation({
  isOpen,
  onNavigate,
}: MobileNavigationProps) {
  const auth = useOptionalAuth();
  const { t } = useI18n();
  const isAuthenticated = auth?.isAuthenticated;

  return (
    <div
      id={MOBILE_NAVIGATION_ID}
      className={cn("md:hidden border-t bg-background", {
        hidden: !isOpen,
        block: isOpen,
      })}
      role="navigation"
      aria-label={t("navigation.menu")}
      aria-hidden={!isOpen}
    >
      <div className="container mx-auto px-4 max-w-7xl py-4 space-y-3">
        {isAuthenticated ? (
          <AuthenticatedMobileMenu
            userName={auth.user?.name}
            userEmail={auth.user?.email}
            onNavigate={onNavigate}
          />
        ) : (
          <GuestMobileMenu onNavigate={onNavigate} />
        )}

        <div className="pt-3 border-t flex justify-end">
          <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
            <Link to="/about" onClick={onNavigate}>
              {t("navigation.about")}
            </Link>
          </Button>
          <GitHubButton />
        </div>
      </div>
    </div>
  );
}
