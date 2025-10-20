import type { TranslationFunctionType } from "~/lib/i18n/types/translations";

export function getRelatedPages(t: TranslationFunctionType) {
  return [
    {
      title: t("legal.terms.title"),
      href: "/terms",
      description: t("legal.terms.description"),
    },
  ];
}
