import { Menu, X } from "lucide-react";

import type { MobileMenuButtonProps } from "../types/type";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

import { MOBILE_NAVIGATION_ID } from "../constants/constants";

export function MobileMenuButton({
  isOpen,
  onToggle,
  buttonRef,
}: MobileMenuButtonProps) {
  const { t } = useI18n();

  return (
    <div className="md:hidden flex items-center space-x-2">
      <LanguageSwitcher />
      <ModeSwitcher />
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={onToggle}
        aria-label={isOpen ? t("navigation.closeMenu") : t("navigation.menu")}
        aria-expanded={isOpen}
        aria-controls={MOBILE_NAVIGATION_ID}
        className="p-2"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );
}
