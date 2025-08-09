import { Home, LogOut, Menu, X } from "lucide-react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Form, Link } from "react-router";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { GitHubButton } from "~/features/landing-page/components/github-button";
import { useOptionalAuth } from "~/lib/auth";
import { isRTLLanguage, useI18n } from "~/lib/i18n";
import { cn } from "~/lib/utils";

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  const auth = useOptionalAuth();
  const { t, language } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isRTL = isRTLLanguage(language);
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
    <header
      className="border-b bg-background sticky top-0 z-50"
      dir={isRTL ? "rtl" : "ltr"}
      role="banner"
    >
      <div className="container flex h-14 items-center justify-between mx-auto px-4 max-w-7xl">
        <Link
          to="/"
          className={cn("flex items-center font-bold text-xl tracking-tight", {
            "space-x-reverse space-x-2": isRTL,
            "space-x-2": !isRTL,
          })}
          onClick={closeMobileMenu}
        >
          <img
            src="/assets/logo-dark.svg"
            alt="NARA"
            className="w-8 h-8 hidden [html.dark_&]:block"
            loading="lazy"
          />
          <img
            src="/assets/logo-light.svg"
            alt="NARA"
            className="w-8 h-8 hidden [html.light_&]:block"
            loading="lazy"
          />
          <span>NARA</span>
        </Link>

        <nav
          className={cn("hidden md:flex items-center", {
            "space-x-reverse space-x-3": isRTL,
            "space-x-3": !isRTL,
          })}
          aria-label={t("navigation.menu")}
        >
          {auth?.isAuthenticated ? (
            <div
              className={cn("flex items-center", {
                "space-x-reverse space-x-3": isRTL,
                "space-x-3": !isRTL,
              })}
            >
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
                <Avatar>
                  <AvatarFallback>
                    {auth.user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
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
            <div
              className={cn("flex items-center", {
                "space-x-reverse space-x-2": isRTL,
                "space-x-2": !isRTL,
              })}
            >
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">{t("navigation.signIn")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">{t("navigation.signUp")}</Link>
              </Button>
            </div>
          )}

          <GitHubButton />
          <LanguageSwitcher />
          <ModeSwitcher />
        </nav>

        <div
          className={cn("md:hidden flex items-center", {
            "space-x-reverse space-x-2": isRTL,
            "space-x-2": !isRTL,
          })}
        >
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
                <div className="flex items-center p-2 bg-muted/30 rounded-lg gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {auth.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
            <GitHubButton />
          </div>
        </div>
      </div>
    </header>
  );
});
