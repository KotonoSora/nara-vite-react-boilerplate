import { LegalPageLayout } from "~/features/shared/components/legal-page-layout";
import { useI18n } from "~/lib/i18n/context";

import { usePageContext } from "./context/page-context";
import { getRelatedPages } from "./utils/get-related-pages";
import { getSections } from "./utils/get-sections";

export function ContentTermsPage() {
  const { t } = useI18n();
  const sections = getSections(t);
  const relatedPages = getRelatedPages(t);

  return (
    <LegalPageLayout
      title={t("legal.terms.title")}
      description={t("legal.terms.description")}
      lastUpdated="08/09/2025"
      sections={sections}
      estimatedReadTime={8}
      relatedPages={relatedPages}
      usePageContext={usePageContext}
    />
  );
}
