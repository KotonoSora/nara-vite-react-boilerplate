import { Home, LogOut, Menu, X } from "lucide-react";
import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Form, Link } from "react-router";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { useOptionalAuth } from "~/lib/auth";
import { useI18n } from "~/lib/i18n";
import { cn } from "~/lib/utils";

import { BrandLogo } from "./brand-logo";

// Lazy-load GitHub button to trim initial JS
const GitHubButtonLazy = lazy(async () => ({
  default: (await import("../../landing-page/components/github-button"))
    .GitHubButton,
}));

// Lightweight avatar to avoid pulling Radix primitives for the header
function UserInitialAvatar({
  initial,
  title,
}: {
  initial?: string;
  title?: string;
}) {
  return (
    <div
      className="relative inline-flex size-8 shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-medium"
      aria-label={title}
    >
      {initial}
    </div>
  );
}

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  const auth = useOptionalAuth();
  const { t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen(!isMobileMenuOpen),
    [isMobileMenuOpen],
  );
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    // Return focus to the menu button when closing
    mobileMenuButtonRef.current?.focus();
  }, []);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    },
    [isMobileMenuOpen, closeMobileMenu],
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        isMobileMenuOpen &&
        !target.closest("#mobile-navigation") &&
        !target.closest("[aria-controls='mobile-navigation']")
      ) {
        closeMobileMenu();
      }
    },
    [isMobileMenuOpen, closeMobileMenu],
  );

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleEscape]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen, handleClickOutside]);

  return (
    <header className="border-b bg-background sticky top-0 z-50" role="banner">
      <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
        <BrandLogo url="/" onClick={closeMobileMenu} />

        <nav
          className="hidden md:flex items-center space-x-3"
          aria-label={t("navigation.menu")}
        >
          {auth?.isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" asChild>
                <Link to="/" title={t("navigation.home")}>
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                aria-label={t("navigation.dashboard")}
                className=""
              >
                <UserInitialAvatar
                  initial={auth.user?.name?.charAt(0).toUpperCase()}
                  title={t("navigation.dashboard")}
                />
              </Link>
              <Form method="post" action="/action/logout">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  title={t("navigation.signOut")}
                >
                  <LogOut
                    className="h-4 w-4"
                    aria-label={t("navigation.signOut")}
                  />
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t("navigation.signIn")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">{t("navigation.signUp")}</Link>
              </Button>
            </div>
          )}

          <Suspense fallback={null}>
            <GitHubButtonLazy />
          </Suspense>
          <LanguageSwitcher />
          <ModeSwitcher />
        </nav>

        <div className="md:hidden flex items-center space-x-2">
          <LanguageSwitcher />
          <ModeSwitcher />
          <Button
            ref={mobileMenuButtonRef}
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            aria-label={
              isMobileMenuOpen
                ? t("navigation.closeMenu")
                : t("navigation.menu")
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={cn("md:hidden border-t bg-background", {
          hidden: !isMobileMenuOpen,
          block: isMobileMenuOpen,
        })}
        role="navigation"
        aria-label={t("navigation.menu")}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="container mx-auto px-4 py-4 max-w-7xl space-y-3">
          {auth?.isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                onClick={closeMobileMenu}
                aria-label={t("navigation.dashboard")}
              >
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
                  <UserInitialAvatar
                    initial={auth.user?.name?.charAt(0).toUpperCase()}
                    title={t("navigation.dashboard")}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium line-clamp-1">
                      {auth.user?.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {auth.user?.email}
                    </div>
                  </div>
                </div>
              </Link>

              <div className="flex flex-row justify-start items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link
                    to="/"
                    onClick={closeMobileMenu}
                    title={t("navigation.home")}
                  >
                    <Home className="h-4 w-4" />
                  </Link>
                </Button>
                <Form method="post" action="/action/logout">
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    onClick={closeMobileMenu}
                    title={t("navigation.signOut")}
                  >
                    <LogOut
                      className="h-4 w-4"
                      aria-label={t("navigation.signOut")}
                    />
                  </Button>
                </Form>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link to="/login" onClick={closeMobileMenu}>
                  {t("navigation.signIn")}
                </Link>
              </Button>
              <Button size="sm" asChild className="w-full">
                <Link to="/register" onClick={closeMobileMenu}>
                  {t("navigation.signUp")}
                </Link>
              </Button>
            </div>
          )}

          <div className="pt-3 border-t flex justify-end">
            <Suspense fallback={null}>
              <GitHubButtonLazy />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
});
