import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import { PopoverContent } from "@kotonosora/ui/components/ui/popover";
import { Link } from "react-router";

import type { MenuCloseHandler } from "../types/type";

import { GitHubButton } from "~/features/shared/components/github-button";
import { useAuth } from "~/lib/authentication/hooks/use-auth";

import { AuthenticatedMenuContent } from "./authenticated-menu-content";
import { GuestMenuContent } from "./guest-menu-content";

export function Menu({ onClose }: MenuCloseHandler) {
  const auth = useAuth();
  const t = useTranslation();
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
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link to="/blog" onClick={onClose} discover="none">
              {t("navigation.blog")}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="shrink-0">
            <Link to="/about" onClick={onClose} discover="none">
              {t("navigation.about")}
            </Link>
          </Button>
          <GitHubButton />
        </div>
      </div>
    </PopoverContent>
  );
}
