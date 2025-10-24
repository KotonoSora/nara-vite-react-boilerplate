import type { TranslationFunction } from "~/lib/i18n/types/translations";

export function getRelatedPages(t: TranslationFunction) {
  return [
    {
      title: t("legal.privacy.title"),
      href: "/privacy",
      description: t("legal.privacy.description"),
    },
  ];
}
