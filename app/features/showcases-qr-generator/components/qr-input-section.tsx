import { type FC } from "react";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { MAX_QR_LENGTH } from "../constants/qr-options";

interface QRInputSectionProps {
  text: string;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const QRInputSection: FC<QRInputSectionProps> = ({
  text,
  onTextChange,
}) => {
  const t = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="qr-text">{t("qrGenerator.inputLabel")}</Label>
        <span className="text-xs text-muted-foreground">
          {text.length}/{MAX_QR_LENGTH}
        </span>
      </div>
      <Textarea
        id="qr-text"
        placeholder={t("qrGenerator.inputPlaceholder")}
        value={text}
        onChange={onTextChange}
        className="w-full min-h-24 resize-y"
        maxLength={MAX_QR_LENGTH}
      />
      {text.length >= MAX_QR_LENGTH && (
        <p className="text-xs text-destructive">
          {t("qrGenerator.maxLengthReached")}
        </p>
      )}
    </div>
  );
};
