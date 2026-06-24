import { useTranslation } from "@kotonosora/i18n-react";
import { Separator } from "@kotonosora/ui/components/ui/separator";
import { Link, useLoaderData } from "react-router";

import type { LegalSection } from "../types/legal";
import type { GeneralInformationType } from "../types/type";

import { ButtonScrollToTop } from "../components/button-scroll-to-top";
import { FooterSection } from "../components/footer-section";
import { LegalContactInfo } from "../components/legal/legal-contact-info";
import { LegalContentSections } from "../components/legal/legal-content-sections";
import { LegalHeader } from "../components/legal/legal-header";
import { LegalRelatedPages } from "../components/legal/legal-related-pages";
import { LegalTableOfContents } from "../components/legal/legal-table-of-contents";
import { HeaderNavigation } from "../header-navigation";
import { useLegalReader } from "../hooks/use-legal-reader";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
  estimatedReadTime?: number;
  relatedPages?: Array<{
    title: string;
    href: string;
    description: string;
  }>;
}

export function LegalPageLayout({
  title,
  description,
  lastUpdated,
  sections,
  estimatedReadTime = 5,
  relatedPages = [],
}: LegalPageLayoutProps) {
  const t = useTranslation();
  const { githubRepository } = useLoaderData<GeneralInformationType>();

  const {
    activeSection,
    readingProgress,
    scrollToSection,
    handlePrint,
    handleShare,
  } = useLegalReader({
    sections,
    title,
    description,
  });

  return (
    <>
      {/* Header Navigation */}
      <HeaderNavigation />

      <div className="min-h-screen bg-background">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-60">
          <div
            className="h-1 bg-primary transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-8 pt-4 lg:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Sidebar - Table of Contents */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-20 space-y-4 lg:space-y-6">
                {/* Back Navigation */}
                <div className="mb-4 lg:mb-6">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {t("legal.common.backToHome")}
                  </Link>
                </div>

                {/* Table of Contents */}
                <LegalTableOfContents
                  sections={sections}
                  activeSection={activeSection}
                  scrollToSection={scrollToSection}
                />

                {/* Related Pages */}
                <LegalRelatedPages relatedPages={relatedPages} />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="max-w-4xl">
                {/* Header */}
                <LegalHeader
                  title={title}
                  description={description}
                  lastUpdated={lastUpdated}
                  estimatedReadTime={estimatedReadTime}
                  onShare={handleShare}
                  onPrint={handlePrint}
                />

                <Separator className="mb-6 lg:mb-8" />

                {/* Content Sections */}
                <LegalContentSections sections={sections} />

                {/* Document Contact Info */}
                <LegalContactInfo githubRepository={githubRepository} />
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Footer */}
        <FooterSection />

        {/* Scroll to Top Button */}
        <ButtonScrollToTop />
      </div>
    </>
  );
}
