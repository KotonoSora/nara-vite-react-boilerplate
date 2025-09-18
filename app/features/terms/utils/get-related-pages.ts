import type { TranslationKey } from "~/lib/i18n/types";

export function getRelatedPages(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) {
  return [
    {
      title: t("legal.privacy.title"),
      href: "/privacy",
      description: t("legal.privacy.description"),
    },
  ];
}
