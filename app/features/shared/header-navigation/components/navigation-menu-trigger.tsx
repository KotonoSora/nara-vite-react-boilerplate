import { Menu, X } from "lucide-react";

import type { MenuTriggerProps } from "../types/type";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { PopoverTrigger } from "~/components/ui/popover";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function MenuTrigger({ isOpen }: MenuTriggerProps) {
  const t = useTranslation();

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
