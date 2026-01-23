import {
  addLanguageToPath,
  getLanguageFromPath,
  isRTLLanguage,
  LANGUAGE_NAMES,
} from "@kotonosora/i18n";
import { SUPPORTED_LANGUAGES } from "@kotonosora/i18n-locales";
import { useLanguage, useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import clsx from "clsx";
import { Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { trackCustomEvents } from "~/features/google-analytics/utils/track-custom-events";
import { useLazyImport } from "~/hooks/use-lazy-import";

// Lazy-load dropdown primitives only when needed to trim initial JS
export function LanguageSwitcher() {
  const t = useTranslation();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically import the dropdown menu module on demand
  const [menuMod, loadMenu] = useLazyImport(
    () => import("@kotonosora/ui/components/ui/dropdown-menu"),
  );
  const [open, setOpen] = useState(false);
  const pendingOpenRef = useRef(false);

  // If user clicked intending to open, open once module is ready
  useEffect(() => {
    if (menuMod && pendingOpenRef.current) {
      setOpen(true);
      pendingOpenRef.current = false;
    }
  }, [menuMod]);

  // RTL-aware dropdown alignment
  const dropdownAlign = isRTLLanguage(language) ? "start" : "end";

  const handleLanguageChange = (
    newLanguage: (typeof SUPPORTED_LANGUAGES)[number],
  ) => {
    // Update the language preference on the server
    setLanguage(newLanguage);

    // Only navigate if current path has a language segment
    const existingLanguage = getLanguageFromPath(location.pathname);
    if (existingLanguage) {
      // Navigate to the same path with the new language
      const newPath = addLanguageToPath(location.pathname, newLanguage);
      navigate(newPath);
    }
    // If no language segment, stay on current path without navigation

    // tracking switch language event
    trackCustomEvents({
      event_category: "Switch",
      event_label: `Switch to the new language ${newLanguage}`,
    });
  };

  // Lightweight trigger shown until user interacts; preloads on hover/focus
  if (!menuMod) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("language")}
        onClick={() => {
          pendingOpenRef.current = true;
          void loadMenu();
        }}
        onMouseEnter={() => void loadMenu()}
        onFocus={() => void loadMenu()}
      >
        <Globe className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{t("language")}</span>
      </Button>
    );
  }

  const {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } = menuMod;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("language")}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dropdownAlign}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={clsx({
              "bg-accent": language === lang,
              "text-right": isRTLLanguage(lang),
              "text-left": !isRTLLanguage(lang),
            })}
            dir={isRTLLanguage(lang) ? "rtl" : "ltr"}
          >
            {LANGUAGE_NAMES[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
