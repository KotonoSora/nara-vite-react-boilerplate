import { Popover } from "@kotonosora/ui/components/ui/popover";
import { useState } from "react";

import { BrandLogo } from "~/features/shared/components/brand-logo";

import { Menu } from "./components/navigation-menu";
import { MenuTrigger } from "./components/navigation-menu-trigger";

export function HeaderNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 max-w-7xl flex h-14 items-center justify-between">
        <BrandLogo url="/" onClick={handleCloseMenu} />
        <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <MenuTrigger isOpen={isMenuOpen} />
          <Menu onClose={handleCloseMenu} />
        </Popover>
      </div>
    </header>
  );
}
