import { useI18n } from "@kotonosora/i18n-react";
import { Card, CardContent } from "@kotonosora/ui/components/ui/card";
import { ScrollArea } from "@kotonosora/ui/components/ui/scroll-area";
import { cn } from "@kotonosora/ui/lib/utils";
import { ChevronRight, FileText } from "lucide-react";
import { useState } from "react";

export interface BlogHeading {
  id: string;
  title: string;
  level: number;
}

interface BlogTableOfContentsProps {
  headings: BlogHeading[];
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export function BlogTableOfContents({
  headings,
  activeSection,
  scrollToSection,
}: BlogTableOfContentsProps) {
  const { t } = useI18n();
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
                {headings.map((heading) => (
                  <li key={heading.id} id={`toc-${heading.id}`}>
                    <button
                      onClick={() => {
                        scrollToSection(heading.id);
                        setIsTocOpen(false);
                      }}
                      className={cn(
                        "w-full text-left p-1.5 rounded-md text-sm flex items-start",
                        heading.level === 3 ? "pl-6 text-xs" : "font-medium",
                        activeSection === heading.id
                          ? "bg-muted font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                      aria-current={
                        activeSection === heading.id ? "location" : undefined
                      }
                    >
                      <span className="flex-1 leading-relaxed truncate whitespace-pre-line">
                        {heading.title}
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
