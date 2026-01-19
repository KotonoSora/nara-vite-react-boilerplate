import type { TranslationFunction } from "@kotonosora/i18n-locales";

export function getRelatedPages(t: TranslationFunction) {
  return [
    {
      title: t("legal.privacy.title"),
      href: "/privacy",
      description: t("legal.privacy.description"),
    },
  ];
}
