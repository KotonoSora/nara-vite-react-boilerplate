import clsx from "clsx";
import {
  ArrowUp,
  ChevronRight,
  Clock,
  FileText,
  Printer,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";
import { isRTLLanguage, useI18n } from "~/lib/i18n";

interface LegalSection {
  id: string;
  title: string;
  content?: string;
  items?: string[];
  subsections?: {
    title: string;
    items: string[];
  }[];
}

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
  const { t, language } = useI18n();
  const isRTL = isRTLLanguage(language);
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300);

      // Update active section based on scroll position
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 120) {
          // Account for header height
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80; // Account for sticky header height
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Header Navigation */}
      <HeaderNavigationSection />

      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
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
                </div>{" "}
                {/* Table of Contents */}
                <Card className="lg:block">
                  <CardContent className="p-3 lg:p-4">
                    <button
                      onClick={() => setIsTocOpen(!isTocOpen)}
                      className="flex items-center justify-between w-full mb-3 lg:mb-4 lg:pointer-events-none"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <h3 className="font-semibold text-sm">
                          {t("legal.common.tableOfContents")}
                        </h3>
                      </div>
                      <ChevronRight
                        className={clsx(
                          "w-4 h-4 transition-transform lg:hidden",
                          isTocOpen && "rotate-90",
                        )}
                      />
                    </button>
                    <div
                      className={clsx(
                        "transition-all duration-300 overflow-hidden",
                        isTocOpen
                          ? "max-h-[400px] opacity-100"
                          : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100",
                      )}
                    >
                      <ScrollArea className="h-[300px] lg:h-[400px]">
                        <nav className="space-y-1 lg:space-y-2">
                          {sections.map((section, index) => (
                            <button
                              key={section.id}
                              onClick={() => {
                                scrollToSection(section.id);
                                setIsTocOpen(false); // Close TOC on mobile after clicking
                              }}
                              className={`w-full text-left text-xs lg:text-sm p-2 rounded-md transition-colors hover:bg-muted flex items-center gap-2 ${
                                activeSection === section.id
                                  ? "bg-muted font-medium text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span className="text-xs text-muted-foreground min-w-[16px] lg:min-w-[20px]">
                                {index + 1}.
                              </span>
                              <span className="flex-1 text-left">
                                {section.title}
                              </span>
                              <ChevronRight className="w-3 h-3 opacity-50" />
                            </button>
                          ))}
                        </nav>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
                {/* Related Pages */}
                {relatedPages.length > 0 && (
                  <Card className="mt-4 lg:mt-6">
                    <CardContent className="p-3 lg:p-4">
                      <h3 className="font-semibold text-sm mb-3 lg:mb-4">
                        {t("legal.common.related")}
                      </h3>
                      <div className="space-y-2 lg:space-y-3">
                        {relatedPages.map((page) => (
                          <Link
                            key={page.href}
                            to={page.href}
                            className="block p-2 lg:p-3 rounded-lg border transition-colors hover:bg-muted"
                          >
                            <div className="font-medium text-xs lg:text-sm">
                              {page.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {page.description}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="max-w-4xl">
                {/* Header */}
                <div className="mb-6 lg:mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" />
                        {estimatedReadTime} {t("legal.common.readingTime")}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="flex-1 sm:flex-initial"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {t("legal.common.share")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="flex-1 sm:flex-initial"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        {t("legal.common.print")}
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    {title}
                  </h1>

                  <p className="text-base lg:text-lg text-muted-foreground mb-4 lg:mb-6">
                    {description}
                  </p>

                  <div className="flex items-center gap-4 text-xs lg:text-sm text-muted-foreground">
                    <span>
                      {t("legal.terms.lastUpdated")}: {lastUpdated}
                    </span>
                  </div>
                </div>

                <Separator className="mb-6 lg:mb-8" />

                {/* Content Sections */}
                <div className="prose prose-sm sm:prose-base prose-gray dark:prose-invert max-w-none">
                  {sections.map((section, index) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="mb-8 lg:mb-12 scroll-mt-24"
                    >
                      <h2 className="text-xl sm:text-2xl font-semibold mb-3 lg:mb-4 flex items-center gap-2 lg:gap-3">
                        <span className="text-primary">{index + 1}.</span>
                        {section.title}
                      </h2>

                      {section.content && (
                        <p className="text-muted-foreground leading-relaxed mb-3 lg:mb-4 text-sm sm:text-base">
                          {section.content}
                        </p>
                      )}

                      {section.subsections?.map((subsection) => (
                        <div key={subsection.title} className="mb-4 lg:mb-6">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2 lg:mb-3">
                            {subsection.title}
                          </h3>
                          <ul className="list-disc list-inside text-muted-foreground space-y-1 lg:space-y-2 text-sm sm:text-base">
                            {subsection.items.map((item, itemIndex) => (
                              <li key={itemIndex}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {section.items && (
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 lg:space-y-2 text-sm sm:text-base">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ))}
                </div>

                {/* Document Contact Info */}
                <div className="mt-12 lg:mt-16 pt-6 lg:pt-8 border-t">
                  <div className="text-center text-xs sm:text-sm text-muted-foreground">
                    <p>
                      {t("legal.common.contactInfo")}{" "}
                      <a
                        href="https://github.com/KotonoSora/nara-vite-react-boilerplate"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {t("legal.common.officialRepository")}
                      </a>{" "}
                      {t("legal.common.supportChannels")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Landing Page Footer */}
        <FooterSection />

        {/* Scroll to Top Button */}
        <Button
          className={clsx(
            "fixed bottom-4 right-4 z-50 rounded-full w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 shadow-lg",
            {
              "opacity-100 translate-y-0": showScrollTop,
              "opacity-0 translate-y-2 pointer-events-none": !showScrollTop,
            },
          )}
          onClick={handleScrollToTop}
          aria-label={t("legal.common.scrollToTop")}
          size="sm"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>
    </>
  );
}
