import { Download } from "lucide-react";
import { type FC } from "react";

import { Button } from "~/components/ui/button";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import type { QRCodeFormat } from "../types/type";

interface QRDownloadButtonsProps {
  onDownload: (format: QRCodeFormat) => void;
}

export const QRDownloadButtons: FC<QRDownloadButtonsProps> = ({
  onDownload,
}) => {
  const t = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() => onDownload("png")}
        className="gap-2"
        variant="default"
      >
        <Download className="w-4 h-4" />
        {t("qrGenerator.downloadPNG")}
      </Button>
      <Button
        onClick={() => onDownload("jpg")}
        className="gap-2"
        variant="outline"
      >
        <Download className="w-4 h-4" />
        {t("qrGenerator.downloadJPG")}
      </Button>
    </div>
  );
};
