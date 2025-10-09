import { Link } from "react-router";

import type { NavigationMenuProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { PopoverContent } from "~/components/ui/popover";
import { useOptionalAuth } from "~/lib/auth/context";
import { useI18n } from "~/lib/i18n/context";

import { GitHubButton } from "../../components/github-button";
import { AuthenticatedMenuContent } from "./authenticated-menu-content";
import { GuestMenuContent } from "./guest-menu-content";

export function NavigationMenu({ onClose }: NavigationMenuProps) {
  const auth = useOptionalAuth();
  const { t } = useI18n();
  const isAuthenticated = auth?.isAuthenticated;

  return (
    <PopoverContent align="end" className="w-80">
      <div className="space-y-3">
        {isAuthenticated ? (
          <AuthenticatedMenuContent
            userName={auth.user?.name}
            userEmail={auth.user?.email}
            onClose={onClose}
          />
        ) : (
          <GuestMenuContent onClose={onClose} />
        )}

        <div className="pt-3 border-t flex justify-end">
          <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
            <Link to="/about" onClick={onClose}>
              {t("navigation.about")}
            </Link>
          </Button>
          <GitHubButton />
        </div>
      </div>
    </PopoverContent>
  );
}
