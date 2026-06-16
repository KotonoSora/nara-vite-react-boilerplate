import { useTranslation } from "@kotonosora/i18n-react";
import { Card, CardContent } from "@kotonosora/ui/components/ui/card";
import { ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router";

interface RelatedPage {
  title: string;
  href: string;
  description: string;
}

interface LegalRelatedPagesProps {
  relatedPages?: RelatedPage[];
}

export function LegalRelatedPages({
  relatedPages = [],
}: LegalRelatedPagesProps) {
  const t = useTranslation();

  if (relatedPages.length === 0) {
    return null;
  }

  return (
    <Card className="py-0">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-medium text-sm">{t("legal.common.related")}</h3>
        </div>
        <ul className="space-y-2" role="list">
          {relatedPages.map((page) => (
            <li key={page.href}>
              <Link
                to={page.href}
                className="block p-2.5 rounded-lg border border-border/50 transition-all duration-200 hover:border-border hover:bg-muted/50 group"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {page.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {page.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
