import { useTranslation } from "@kotonosora/i18n-react";
import { Badge } from "@kotonosora/ui/components/ui/badge";
import { Button } from "@kotonosora/ui/components/ui/button";
import { Clock, Printer, Share2 } from "lucide-react";

interface LegalHeaderProps {
  title: string;
  description: string;
  lastUpdated: string;
  estimatedReadTime?: number;
  onShare: () => void;
  onPrint: () => void;
}

export function LegalHeader({
  title,
  description,
  lastUpdated,
  estimatedReadTime = 5,
  onShare,
  onPrint,
}: LegalHeaderProps) {
  const t = useTranslation();

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {estimatedReadTime} {t("legal.common.readingTime")}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="flex-1 sm:flex-initial"
          >
            <Share2 className="w-4 h-4 mr-2" />
            {t("legal.common.share")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
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
  );
}
