import { useTranslation } from "@kotonosora/i18n-react";
import { Label } from "@kotonosora/ui/components/ui/label";
import { Textarea } from "@kotonosora/ui/components/ui/textarea";
import { type FC } from "react";

interface QRInputSectionProps {
  text: string;
  maxLength: number;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const QRInputSection: FC<QRInputSectionProps> = ({
  text,
  maxLength,
  onTextChange,
}) => {
  const t = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="qr-text">{t("qrGenerator.inputLabel")}</Label>
        <span className="text-xs text-muted-foreground">
          {text.length}/{maxLength}
        </span>
      </div>
      <Textarea
        id="qr-text"
        placeholder={t("qrGenerator.inputPlaceholder")}
        value={text}
        onChange={onTextChange}
        className="w-full min-h-24 resize-y"
        maxLength={maxLength}
      />
      {text.length >= maxLength && (
        <p className="text-xs text-destructive">
          {t("qrGenerator.maxLengthReached")}
        </p>
      )}
    </div>
  );
};
