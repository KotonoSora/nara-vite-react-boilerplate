import clsx from "clsx";
import { Globe } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  isRTLLanguage,
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  useI18n,
  useLanguage,
} from "~/lib/i18n";

export function LanguageSwitcher() {
  const { t } = useI18n();
  const { language, setLanguage } = useLanguage();

  // RTL-aware dropdown alignment
  const dropdownAlign = isRTLLanguage(language) ? "start" : "end";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("common.language")}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("common.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dropdownAlign}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
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
