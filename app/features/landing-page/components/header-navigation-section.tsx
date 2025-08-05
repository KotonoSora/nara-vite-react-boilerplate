import { Menu, X } from "lucide-react";
import { memo, useEffect, useState } from "react";
import { Form, Link } from "react-router";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { GitHubButton } from "~/features/landing-page/components/github-button";
import { useOptionalAuth } from "~/lib/auth/context";
import { isRTLLanguage } from "~/lib/i18n/config";
import { useI18n } from "~/lib/i18n/context";

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  const auth = useOptionalAuth();
  const { t, language } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isRTL = isRTLLanguage(language);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        isMobileMenuOpen &&
        !target.closest("#mobile-navigation") &&
        !target.closest("[aria-controls='mobile-navigation']")
      ) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container flex h-14 items-center justify-between mx-auto px-4">
        {/* Logo Section */}
        <div
          className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
        >
          <Link
            to="/"
            className={`flex items-center hover:opacity-80 transition-opacity ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
            onClick={closeMobileMenu}
          >
            <img
              src="/assets/logo-dark.svg"
              alt=""
              className="w-8 h-8 hidden [html.dark_&]:block"
              loading="lazy"
            />
            <img
              src="/assets/logo-light.svg"
              alt=""
              className="w-8 h-8 hidden [html.light_&]:block"
              loading="lazy"
            />
            <h2 className="text-xl font-bold">NARA</h2>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div
          className={`hidden md:flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
        >
          {auth?.isAuthenticated ? (
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
            >
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">{t("navigation.dashboard")}</Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden lg:inline truncate max-w-32">
                {auth.user?.name}
              </span>
              <Form method="post" action="/action/logout">
                <Button type="submit" variant="outline" size="sm">
                  {t("navigation.signOut")}
                </Button>
              </Form>
            </div>
          ) : (
            <div
              className={`flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
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
        </div>

        {/* Mobile Menu Button */}
        <div
          className={`md:hidden flex items-center ${isRTL ? "space-x-reverse space-x-2" : "space-x-2"}`}
        >
          <LanguageSwitcher />
          <ModeSwitcher />
          <Button
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

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-navigation"
        className={`md:hidden border-t bg-background/95 backdrop-blur-sm transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
        role="navigation"
        aria-label={t("navigation.menu")}
      >
        <div
          className={`container mx-auto px-4 py-4 ${isRTL ? "space-y-reverse space-y-3" : "space-y-3"}`}
        >
          {auth?.isAuthenticated ? (
            <>
              <div
                className={`flex items-center pb-3 border-b ${isRTL ? "space-x-reverse space-x-3" : "space-x-3"}`}
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {auth.user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium truncate">
                  {auth.user?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={`w-full ${isRTL ? "justify-end" : "justify-start"}`}
              >
                <Link to="/dashboard" onClick={closeMobileMenu}>
                  {t("navigation.dashboard")}
                </Link>
              </Button>
              <Form method="post" action="/action/logout" className="w-full">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className={`w-full ${isRTL ? "justify-end" : "justify-start"}`}
                  onClick={closeMobileMenu}
                >
                  {t("navigation.signOut")}
                </Button>
              </Form>
            </>
          ) : (
            <div className={isRTL ? "space-y-reverse space-y-3" : "space-y-3"}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className={`w-full ${isRTL ? "justify-end" : "justify-start"}`}
              >
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
          <div className="pt-3 border-t">
            <GitHubButton />
          </div>
        </div>
      </div>
    </header>
  );
});
