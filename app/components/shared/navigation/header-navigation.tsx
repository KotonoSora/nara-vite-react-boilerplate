import { Menu } from "lucide-react";
import type { FC } from "react";
import { Form, Link } from "react-router";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { GitHubButton } from "~/features/landing-page/components/github-button";
import { useOptionalAuth } from "~/lib/auth";
import { LAYOUT_CONSTANTS, NAVIGATION_IDS } from "~/lib/constants/ui";
import { useMobileNavigation } from "~/lib/hooks/use-mobile-navigation";
import { isRTLLanguage, useI18n } from "~/lib/i18n";
import { cn } from "~/lib/utils";

import { MobileNavigation } from "./mobile-navigation";
import type { HeaderNavigationProps, NavigationItem } from "./types";

const defaultNavigationItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", protected: true },
  { href: "/showcase", label: "Showcase" },
  { href: "/admin", label: "Admin", protected: true },
];

export const HeaderNavigation: FC<HeaderNavigationProps> = ({
  showAuth = true,
  showLanguageSwitcher = true,
  showModeSwitcher = true,
  showGitHub = true,
  customItems,
}) => {
  const auth = useOptionalAuth();
  const { t, language } = useI18n();
  const isRTL = isRTLLanguage(language);
  const { isOpen, close, toggle } = useMobileNavigation();

  const navigationItems = customItems || defaultNavigationItems;
  const visibleItems = navigationItems.filter(
    (item) => !item.protected || auth?.user,
  );

  const AuthButtons = () => {
    if (!showAuth) return null;

    if (auth?.user) {
      return (
        <Form method="post" action="/action/logout" className="inline">
          <Button variant="outline" type="submit">
{t("navigation.signOut")}
          </Button>
        </Form>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
<Link to="/login">{t("navigation.signIn")}</Link>
        </Button>
        <Button asChild>
<Link to="/register">{t("navigation.signUp")}</Link>
        </Button>
      </div>
    );
  };

  const Controls = () => (
    <div className="flex items-center gap-2">
      {showLanguageSwitcher && <LanguageSwitcher />}
      {showModeSwitcher && <ModeSwitcher />}
      {showGitHub && <GitHubButton />}
      <AuthButtons />
    </div>
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b",
          LAYOUT_CONSTANTS.HEADER_HEIGHT,
        )}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
            >
              NARA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {visibleItems.map((item, index) => {
                if (item.external) {
                  return (
                    <a
                      key={`${item.href}-${index}`}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={`${item.href}-${index}`}
                    to={item.href}
                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Controls */}
            <div className="hidden md:flex">
              <Controls />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <div className="flex md:hidden">
                <Controls />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggle}
                aria-controls={NAVIGATION_IDS.MOBILE}
                aria-expanded={isOpen}
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNavigation items={visibleItems} isOpen={isOpen} onClose={close} />
    </>
  );
};