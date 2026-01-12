import { useTranslation } from "@kotonosora/i18n-react";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";

import { QRCodeGenerator } from "./components/qr-code-generator";

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
        <QRCodeGenerator />
      </section>

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
