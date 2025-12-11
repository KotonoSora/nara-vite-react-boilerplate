import { lazy, Suspense } from "react";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

const QRCodeGenerator = lazy(() =>
  import("./components/qr-code-generator").then((m) => ({ default: m.QRCodeGenerator }))
);

function QRLoader() {
  return (
    <div className="w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading QR generator...</div>
    </div>
  );
}

export function QRGeneratorPage() {
  const t = useTranslation();

  return (
    <main className="min-h-svh bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

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
        <Suspense fallback={<QRLoader />}>
          <QRCodeGenerator />
        </Suspense>
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
