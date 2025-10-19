import type { TranslationFunctionType } from "~/lib/i18n/utils/translations";

export function getRelatedPages(t: TranslationFunctionType) {
  return [
    {
      title: t("legal.privacy.title"),
      href: "/privacy",
      description: t("legal.privacy.description"),
    },
  ];
}
