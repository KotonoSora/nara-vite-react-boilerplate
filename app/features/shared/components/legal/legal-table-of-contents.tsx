import { useTranslation } from "@kotonosora/i18n-react";
import { Card, CardContent } from "@kotonosora/ui/components/ui/card";
import { ScrollArea } from "@kotonosora/ui/components/ui/scroll-area";
import { cn } from "@kotonosora/ui/lib/utils";
import { ChevronRight, FileText } from "lucide-react";
import { useState } from "react";

import type { LegalSection } from "../../types/legal";

interface LegalTableOfContentsProps {
  sections: LegalSection[];
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export function LegalTableOfContents({
  sections,
  activeSection,
  scrollToSection,
}: LegalTableOfContentsProps) {
  const t = useTranslation();
  const [isTocOpen, setIsTocOpen] = useState(false);

  return (
    <Card className="py-0">
      <CardContent className="p-0">
        {/* Mobile collapsible header */}
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="flex items-center justify-between w-full p-3 text-left hover:bg-muted/50 transition-colors lg:cursor-default lg:pointer-events-none"
          aria-expanded={isTocOpen}
          aria-controls="toc-content"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium text-sm">
              {t("legal.common.tableOfContents")}
            </span>
          </div>
          <ChevronRight
            className={cn(
              "w-4 h-4 text-muted-foreground",
              isTocOpen && "rotate-90",
            )}
          />
        </button>

        {/* Content */}
        <div
          id="toc-content"
          className={cn(
            "overflow-hidden lg:max-h-none lg:opacity-100",
            isTocOpen
              ? "max-h-100 opacity-100 border-t border-border/50"
              : "max-h-0 opacity-0 lg:border-t lg:border-border/50",
          )}
        >
          <ScrollArea className="h-87.5 lg:h-100">
            <nav className="p-3" aria-label={t("legal.common.tableOfContents")}>
              <ul className="space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        scrollToSection(section.id);
                        setIsTocOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-1.5 rounded-md text-sm flex items-start gap-2.5",
                        activeSection === section.id
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                      aria-current={
                        activeSection === section.id ? "location" : undefined
                      }
                    >
                      <span className="shrink-0 text-xs text-muted-foreground min-w-5 mt-0.5">
                        {index + 1}.
                      </span>
                      <span className="flex-1 leading-relaxed">
                        {section.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
