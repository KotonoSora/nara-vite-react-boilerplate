import type { TranslationKey } from "~/lib/i18n";

export function getSections(
  t: (key: TranslationKey, params?: Record<string, string | number>) => string,
) {
  return [
    {
      id: "collection",
      title: t("legal.privacy.sections.collection.title"),
      content: t("legal.privacy.sections.collection.content"),
      subsections: [
        {
          title: t("legal.privacy.sections.collection.personal.title"),
          items: [
            t("legal.privacy.sections.collection.personal.items.0"),
            t("legal.privacy.sections.collection.personal.items.1"),
            t("legal.privacy.sections.collection.personal.items.2"),
          ],
        },
        {
          title: t("legal.privacy.sections.collection.usage.title"),
          items: [
            t("legal.privacy.sections.collection.usage.items.0"),
            t("legal.privacy.sections.collection.usage.items.1"),
            t("legal.privacy.sections.collection.usage.items.2"),
          ],
        },
      ],
    },
    {
      id: "usage",
      title: t("legal.privacy.sections.usage.title"),
      content: t("legal.privacy.sections.usage.content"),
      items: [
        t("legal.privacy.sections.usage.items.0"),
        t("legal.privacy.sections.usage.items.1"),
        t("legal.privacy.sections.usage.items.2"),
        t("legal.privacy.sections.usage.items.3"),
        t("legal.privacy.sections.usage.items.4"),
        t("legal.privacy.sections.usage.items.5"),
      ],
    },
    {
      id: "sharing",
      title: t("legal.privacy.sections.sharing.title"),
      content: t("legal.privacy.sections.sharing.content"),
      items: [
        t("legal.privacy.sections.sharing.items.0"),
        t("legal.privacy.sections.sharing.items.1"),
        t("legal.privacy.sections.sharing.items.2"),
        t("legal.privacy.sections.sharing.items.3"),
      ],
    },
    {
      id: "security",
      title: t("legal.privacy.sections.security.title"),
      content: t("legal.privacy.sections.security.content"),
    },
    {
      id: "retention",
      title: t("legal.privacy.sections.retention.title"),
      content: t("legal.privacy.sections.retention.content"),
    },
    {
      id: "rights",
      title: t("legal.privacy.sections.rights.title"),
      content: t("legal.privacy.sections.rights.content"),
      items: [
        t("legal.privacy.sections.rights.items.0"),
        t("legal.privacy.sections.rights.items.1"),
        t("legal.privacy.sections.rights.items.2"),
        t("legal.privacy.sections.rights.items.3"),
        t("legal.privacy.sections.rights.items.4"),
        t("legal.privacy.sections.rights.items.5"),
      ],
    },
    {
      id: "cookies",
      title: t("legal.privacy.sections.cookies.title"),
      content: t("legal.privacy.sections.cookies.content"),
    },
    {
      id: "children",
      title: t("legal.privacy.sections.children.title"),
      content: t("legal.privacy.sections.children.content"),
    },
    {
      id: "policyChanges",
      title: t("legal.privacy.sections.policyChanges.title"),
      content: t("legal.privacy.sections.policyChanges.content"),
    },
    {
      id: "contact",
      title: t("legal.privacy.sections.contact.title"),
      content: t("legal.privacy.sections.contact.content"),
    },
  ];
}
