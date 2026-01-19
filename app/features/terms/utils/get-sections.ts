import type { TranslationFunction } from "@kotonosora/i18n-locales";

export function getSections(t: TranslationFunction) {
  return [
    {
      id: "acceptance",
      title: t("legal.terms.sections.acceptance.title"),
      content: t("legal.terms.sections.acceptance.content"),
    },
    {
      id: "description",
      title: t("legal.terms.sections.description.title"),
      content: t("legal.terms.sections.description.content"),
    },
    {
      id: "responsibilities",
      title: t("legal.terms.sections.responsibilities.title"),
      content: t("legal.terms.sections.responsibilities.content"),
      items: [
        t("legal.terms.sections.responsibilities.items.0"),
        t("legal.terms.sections.responsibilities.items.1"),
        t("legal.terms.sections.responsibilities.items.2"),
        t("legal.terms.sections.responsibilities.items.3"),
      ],
    },
    {
      id: "intellectual",
      title: t("legal.terms.sections.intellectual.title"),
      content: t("legal.terms.sections.intellectual.content"),
    },
    {
      id: "privacy",
      title: t("legal.terms.sections.privacy.title"),
      content: t("legal.terms.sections.privacy.content"),
    },
    {
      id: "liability",
      title: t("legal.terms.sections.liability.title"),
      content: t("legal.terms.sections.liability.content"),
    },
    {
      id: "changes",
      title: t("legal.terms.sections.changes.title"),
      content: t("legal.terms.sections.changes.content"),
    },
    {
      id: "contact",
      title: t("legal.terms.sections.contact.title"),
      content: t("legal.terms.sections.contact.content"),
    },
  ];
}
