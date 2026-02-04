import { useTranslation } from "@kotonosora/i18n-react";

import { QRCodeGenerator } from "./components/qr-code-generator";

export function QRGeneratorPage({
  isProd,
  trackingId,
}: {
  isProd: boolean;
  trackingId: string | undefined;
}) {
  const t = useTranslation();

  return (
    <>
      {/* Page Header */}
      <section className="container mx-auto px-4 py-8 sm:py-12 space-y-4">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {t("qrGenerator.title")}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            {t("qrGenerator.description")}
          </p>
        </div>
      </section>

      {/* QR Generator Content */}
      <section className="container mx-auto px-4 pb-12">
        <QRCodeGenerator isProd={isProd} trackingId={trackingId} />
      </section>
    </>
  );
}
