import { type FC } from "react";

import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export const QREmptyState: FC = () => {
  const t = useTranslation();

  return (
    <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
      <p className="text-muted-foreground">{t("qrGenerator.emptyState")}</p>
    </div>
  );
};
