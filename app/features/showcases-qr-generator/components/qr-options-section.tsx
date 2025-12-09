import { type FC } from "react";

import type { QRCodeOptions } from "../types/type";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import {
  QR_ERROR_CORRECTION_OPTIONS,
  QR_MARGIN_OPTIONS,
  QR_SIZE_OPTIONS,
} from "../constants/qr-options";

interface QROptionsSectionProps {
  options: QRCodeOptions;
  onUpdateOptions: (newOptions: Partial<QRCodeOptions>) => void;
}

export const QROptionsSection: FC<QROptionsSectionProps> = ({
  options,
  onUpdateOptions,
}) => {
  const t = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="qr-size">{t("qrGenerator.sizeLabel")}</Label>
        <Select
          value={options.size.toString()}
          onValueChange={(value) => onUpdateOptions({ size: parseInt(value) })}
        >
          <SelectTrigger id="qr-size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QR_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qr-level">
          {t("qrGenerator.errorCorrectionLabel")}
        </Label>
        <Select
          value={options.level}
          onValueChange={(value) =>
            onUpdateOptions({ level: value as QRCodeOptions["level"] })
          }
        >
          <SelectTrigger id="qr-level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QR_ERROR_CORRECTION_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="qr-margin">{t("qrGenerator.marginLabel")}</Label>
        <Select
          value={options.marginSize.toString()}
          onValueChange={(value) =>
            onUpdateOptions({ marginSize: parseInt(value) })
          }
        >
          <SelectTrigger id="qr-margin">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {QR_MARGIN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(`qrGenerator.${option.label}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
