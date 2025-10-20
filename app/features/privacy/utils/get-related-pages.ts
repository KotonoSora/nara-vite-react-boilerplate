import type { TranslationFunction } from "~/lib/i18n/types/translations";

export function getRelatedPages(t: TranslationFunction) {
  return [
    {
      title: t("legal.terms.title"),
      href: "/terms",
      description: t("legal.terms.description"),
    },
  ];
}
