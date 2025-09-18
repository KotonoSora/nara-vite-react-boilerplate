import type { TranslationKey } from "~/lib/i18n/types";

export function getRelatedPages(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) {
  return [
    {
      title: t("legal.terms.title"),
      href: "/terms",
      description: t("legal.terms.description"),
    },
  ];
}
