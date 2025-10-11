import { LegalPageLayout } from "~/features/shared/layout/legal-page-layout";
import { useI18n } from "~/lib/i18n/context";

import { getRelatedPages } from "./utils/get-related-pages";
import { getSections } from "./utils/get-sections";

export function ContentPrivacyPage() {
  const { t } = useI18n();
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
