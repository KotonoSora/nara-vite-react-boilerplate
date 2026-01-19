import type { TranslationFunction } from "@kotonosora/i18n-locales";

export function getRelatedPages(t: TranslationFunction) {
  return [
    {
      title: t("legal.terms.title"),
      href: "/terms",
      description: t("legal.terms.description"),
    },
  ];
}
