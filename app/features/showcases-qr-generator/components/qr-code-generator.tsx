import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { type FC, useRef, useState } from "react";

import type { QRCodeFormat, QRCodeOptions } from "../types/type";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export const QRCodeGenerator: FC = () => {
  const t = useTranslation();
  const qrRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<QRCodeOptions>({
    size: 256,
    level: "H",
    includeMargin: true,
  });

  const handleDownload = (format: QRCodeFormat) => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas || !text) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qrcode.${format}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      },
      format === "jpg" ? "image/jpeg" : "image/png",
      1.0,
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section */}
      <div className="space-y-4 p-6 bg-card rounded-lg border">
        <div className="space-y-2">
          <Label htmlFor="qr-text">{t("qrGenerator.inputLabel")}</Label>
          <Input
            id="qr-text"
            type="text"
            placeholder={t("qrGenerator.inputPlaceholder")}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qr-size">{t("qrGenerator.sizeLabel")}</Label>
            <Select
              value={options.size.toString()}
              onValueChange={(value) =>
                setOptions({ ...options, size: parseInt(value) })
              }
            >
              <SelectTrigger id="qr-size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="128">128x128</SelectItem>
                <SelectItem value="256">256x256</SelectItem>
                <SelectItem value="512">512x512</SelectItem>
                <SelectItem value="1024">1024x1024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-level">{t("qrGenerator.errorCorrectionLabel")}</Label>
            <Select
              value={options.level}
              onValueChange={(value) =>
                setOptions({ ...options, level: value as QRCodeOptions["level"] })
              }
            >
              <SelectTrigger id="qr-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">L (7%)</SelectItem>
                <SelectItem value="M">M (15%)</SelectItem>
                <SelectItem value="Q">Q (25%)</SelectItem>
                <SelectItem value="H">H (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qr-margin">{t("qrGenerator.marginLabel")}</Label>
            <Select
              value={options.includeMargin ? "yes" : "no"}
              onValueChange={(value) =>
                setOptions({ ...options, includeMargin: value === "yes" })
              }
            >
              <SelectTrigger id="qr-margin">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">{t("qrGenerator.yes")}</SelectItem>
                <SelectItem value="no">{t("qrGenerator.no")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* QR Code Preview */}
      {text && (
        <div className="space-y-4 p-6 bg-card rounded-lg border">
          <h3 className="text-lg font-semibold">{t("qrGenerator.preview")}</h3>
          <div
            ref={qrRef}
            className="flex justify-center items-center p-8 bg-white rounded-lg overflow-hidden"
          >
            <QRCodeCanvas
              value={text}
              size={options.size}
              level={options.level}
              includeMargin={options.includeMargin}
              className="max-w-full h-auto"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* Download Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleDownload("png")}
              className="gap-2"
              variant="default"
            >
              <Download className="w-4 h-4" />
              {t("qrGenerator.downloadPNG")}
            </Button>
            <Button
              onClick={() => handleDownload("jpg")}
              className="gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              {t("qrGenerator.downloadJPG")}
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!text && (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground">{t("qrGenerator.emptyState")}</p>
        </div>
      )}
    </div>
  );
};
