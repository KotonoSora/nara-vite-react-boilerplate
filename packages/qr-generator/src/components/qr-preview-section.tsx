import { useTranslation } from "@kotonosora/i18n-react";
import { QRCodeSVG } from "qrcode.react";

import { QRPreviewSectionProps } from "@/types/preview-section-type";

export function QRPreviewSection({
  qrRef,
  text,
  options,
}: QRPreviewSectionProps) {
  const t = useTranslation();

  return (
    <div className="space-y-4 p-6 bg-card rounded-lg border">
      <h3 className="text-lg font-semibold">{t("qrGenerator.preview")}</h3>
      <div
        ref={qrRef}
        className="flex justify-center items-center p-8 bg-white rounded-lg overflow-hidden"
      >
        <QRCodeSVG
          value={text}
          size={options.size}
          level={options.level}
          marginSize={options.marginSize}
          className="max-w-full h-auto"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
