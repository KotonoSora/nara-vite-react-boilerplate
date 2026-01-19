import { useTranslation } from "@kotonosora/i18n-react";

import { LegalPageLayout } from "~/features/shared/layout/legal-page-layout";

import { getRelatedPages } from "./utils/get-related-pages";
import { getSections } from "./utils/get-sections";

export function ContentPrivacyPage() {
  const t = useTranslation();
  const sections = getSections(t);
  const relatedPages = getRelatedPages(t);

  return (
    <LegalPageLayout
      title={t("legal.privacy.title")}
      description={t("legal.privacy.description")}
      lastUpdated="08/09/2025"
      sections={sections}
      estimatedReadTime={12}
      relatedPages={relatedPages}
    />
  );
}
