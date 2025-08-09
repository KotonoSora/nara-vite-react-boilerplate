import { LegalPageLayout } from "~/features/legal/shared/legal/legal-page-layout";
import { useI18n } from "~/lib/i18n";

export function ContentTermsPage() {
  const { t } = useI18n();

  const sections = [
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

  const relatedPages = [
    {
      title: t("legal.privacy.title"),
      href: "/privacy",
      description: t("legal.privacy.description"),
    },
  ];

  return (
    <LegalPageLayout
      title={t("legal.terms.title")}
      description={t("legal.terms.description")}
      lastUpdated={new Date().toLocaleDateString()}
      sections={sections}
      estimatedReadTime={8}
      relatedPages={relatedPages}
    />
  );
}
