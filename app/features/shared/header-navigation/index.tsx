import { BrandLogo } from "../components/brand-logo";
import { DesktopNavigation } from "./components/desktop-navigation";
import { MobileMenuButton } from "./components/mobile-menu-button";
import { MobileNavigation } from "./components/mobile-navigation";
import { useMobileMenu } from "./hooks/use-mobile-menu";

export function HeaderNavigation() {
  const {
    isOpen: isMobileMenuOpen,
    toggle: toggleMobileMenu,
    close: closeMobileMenu,
    buttonRef: mobileMenuButtonRef,
  } = useMobileMenu();

  return (
    <header className="border-b bg-background sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
        <BrandLogo url="/" onClick={closeMobileMenu} />
        <DesktopNavigation onNavigate={closeMobileMenu} />
        <MobileMenuButton
          isOpen={isMobileMenuOpen}
          onToggle={toggleMobileMenu}
          buttonRef={mobileMenuButtonRef}
        />
      </div>
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onNavigate={closeMobileMenu}
      />
    </header>
  );
}
