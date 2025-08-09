import clsx from "clsx";
import { Globe } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import {
  addLanguageToPath,
  getLanguageFromPath,
  isRTLLanguage,
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  useI18n,
  useLanguage,
} from "~/lib/i18n";

// Lazy-load dropdown primitives only when needed to trim initial JS
export function LanguageSwitcher() {
  const { t } = useI18n();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Dynamically import the dropdown menu module on demand
  const [menuMod, setMenuMod] = useState<
    null | typeof import("~/components/ui/dropdown-menu")
  >(null);
  const [open, setOpen] = useState(false);
  const pendingOpenRef = useRef(false);
  // Cache the dynamic import to avoid recreating callbacks and duplicate imports
  const menuPromiseRef = useRef<Promise<
    typeof import("~/components/ui/dropdown-menu")
  > | null>(null);

  // Ref to hold the loaded module to avoid race conditions and stale closures
  const menuModRef = useRef<
    null | typeof import("~/components/ui/dropdown-menu")
  >(null);

  const loadMenu = useCallback(async () => {
    // If already loaded, no work
    if (menuModRef.current) return;
    // If an import is in-flight, await it
    if (menuPromiseRef.current) {
      const mod = await menuPromiseRef.current;
      // set state only if not yet set
      if (!menuModRef.current) {
        menuModRef.current = mod;
        setMenuMod(mod);
      }
      return;
    }
    // Start a single import and cache its promise
    menuPromiseRef.current = import("~/components/ui/dropdown-menu");
    const mod = await menuPromiseRef.current;
    if (!menuModRef.current) {
      menuModRef.current = mod;
      setMenuMod(mod);
    }
  }, []);

  // If user clicked intending to open, open once module is ready
  useEffect(() => {
    if (menuMod && pendingOpenRef.current) {
      setOpen(true);
      pendingOpenRef.current = false;
    }
  }, [menuMod]);

  // RTL-aware dropdown alignment
  const dropdownAlign = isRTLLanguage(language) ? "start" : "end";

  const handleLanguageChange = useCallback(
    (newLanguage: (typeof SUPPORTED_LANGUAGES)[number]) => {
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
    },
    [setLanguage, location.pathname, navigate],
  );

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
