import { Menu, X } from "lucide-react";

import type { NavigationMenuTriggerProps } from "../types/type";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { PopoverTrigger } from "~/components/ui/popover";
import { useI18n } from "~/lib/i18n/context";

export function NavigationMenuTrigger({ isOpen }: NavigationMenuTriggerProps) {
  const { t } = useI18n();

  return (
    <div className="flex items-center space-x-2">
      <LanguageSwitcher />
      <ModeSwitcher />
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label={isOpen ? t("navigation.closeMenu") : t("navigation.menu")}
          className="p-2"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </PopoverTrigger>
    </div>
  );
}
