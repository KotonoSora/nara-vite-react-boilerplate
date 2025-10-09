import { useState } from "react";

import { Popover } from "~/components/ui/popover";

import { BrandLogo } from "../components/brand-logo";
import { NavigationMenu } from "./components/navigation-menu";
import { NavigationMenuTrigger } from "./components/navigation-menu-trigger";

export function HeaderNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
        <BrandLogo url="/" onClick={closeMenu} />
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <NavigationMenuTrigger isOpen={isMenuOpen} />
          <NavigationMenu onClose={closeMenu} />
        </Popover>
      </div>
    </header>
  );
}
