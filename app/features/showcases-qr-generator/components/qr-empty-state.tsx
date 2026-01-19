import { useTranslation } from "@kotonosora/i18n-react";
import { type FC } from "react";

export const QREmptyState: FC = () => {
  const t = useTranslation();

  return (
    <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
      <p className="text-muted-foreground">{t("qrGenerator.emptyState")}</p>
    </div>
  );
};
