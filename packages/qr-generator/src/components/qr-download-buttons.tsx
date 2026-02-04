import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import { Download } from "lucide-react";

import type { QRCodeFormat } from "../types/format-type";

import { QRDownloadButtonsProps } from "@/types/download-button-type";

export function QRDownloadButtons({ onDownload }: QRDownloadButtonsProps) {
  const t = useTranslation();

  const handleDownload =
    (format: QRCodeFormat) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      onDownload(format);
    };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={handleDownload("png")}
        className="gap-2 cursor-pointer"
        variant="default"
      >
        <Download className="w-4 h-4" />
        {t("qrGenerator.downloadPNG")}
      </Button>
      <Button
        onClick={handleDownload("jpg")}
        className="gap-2 cursor-pointer"
        variant="outline"
      >
        <Download className="w-4 h-4" />
        {t("qrGenerator.downloadJPG")}
      </Button>
    </div>
  );
}
