import { ChevronRight, Clock, FileText, Printer, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

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
  const [activeSection, setActiveSection] = useState<string>("");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(Math.min(progress, 100));

      // Update active section based on scroll position
      const sectionElements = sections
        .map((section) => document.getElementById(section.id))
        .filter(Boolean);

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i];
        if (element && element.getBoundingClientRect().top <= 100) {
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
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div
          className="h-1 bg-primary transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Sidebar - Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Back Navigation */}
              <div className="mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>

              {/* Table of Contents */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-4 h-4" />
                    <h3 className="font-semibold text-sm">Table of Contents</h3>
                  </div>
                  <ScrollArea className="h-[400px]">
                    <nav className="space-y-2">
                      {sections.map((section, index) => (
                        <button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          className={`w-full text-left text-sm p-2 rounded-md transition-colors hover:bg-muted flex items-center gap-2 ${
                            activeSection === section.id
                              ? "bg-muted font-medium text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-xs text-muted-foreground min-w-[20px]">
                            {index + 1}.
                          </span>
                          <span className="flex-1">{section.title}</span>
                          <ChevronRight className="w-3 h-3 opacity-50" />
                        </button>
                      ))}
                    </nav>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Related Pages */}
              {relatedPages.length > 0 && (
                <Card className="mt-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-4">Related</h3>
                    <div className="space-y-3">
                      {relatedPages.map((page) => (
                        <Link
                          key={page.href}
                          to={page.href}
                          className="block p-3 rounded-lg border transition-colors hover:bg-muted"
                        >
                          <div className="font-medium text-sm">
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
          <div className="lg:col-span-3">
            <div className="max-w-4xl">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" />
                      {estimatedReadTime} min read
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="hidden sm:inline-flex"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrint}
                      className="hidden sm:inline-flex"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </Button>
                  </div>
                </div>

                <h1 className="text-4xl font-bold tracking-tight mb-4">
                  {title}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  {description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Last updated: {lastUpdated}</span>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Content Sections */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                {sections.map((section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="mb-12 scroll-mt-20"
                  >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                      <span className="text-primary">{index + 1}.</span>
                      {section.title}
                    </h2>

                    {section.content && (
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {section.content}
                      </p>
                    )}

                    {section.subsections?.map((subsection) => (
                      <div key={subsection.title} className="mb-6">
                        <h3 className="text-xl font-semibold mb-3">
                          {subsection.title}
                        </h3>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                          {subsection.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {section.items && (
                      <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-16 pt-8 border-t">
                <div className="text-center text-sm text-muted-foreground">
                  <p>
                    For questions about this document, please contact us through
                    our{" "}
                    <a
                      href="https://github.com/KotonoSora/nara-vite-react-boilerplate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      official repository
                    </a>{" "}
                    or support channels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
