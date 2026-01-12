import { useTranslation } from "@kotonosora/i18n-react";
import { Menu, X } from "lucide-react";

import type { MenuTriggerProps } from "../types/type";

import { Button } from "~/components/ui/button";
import { PopoverTrigger } from "~/components/ui/popover";

import { LanguageSwitcher } from "./language-switcher";
import { ModeSwitcher } from "./mode-switcher";

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
