import { generateMetaTags } from "@kotonosora/seo";
import { lazy } from "react";

import type { Route } from "./+types/($lang).showcases.qr-generator";

import type { MiddlewareFunction } from "react-router";

import { FooterSection } from "~/features/shared/components/footer-section";
import { HeaderNavigation } from "~/features/shared/header-navigation";
import {
  qrGeneratorMiddleware,
  qrGeneratorMiddlewareContext,
} from "~/features/showcases-qr-generator/middleware/qr-generator-middleware";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

// Lazy load QRGeneratorPage to prevent qrcode.react from being bundled in SSR
const QRGeneratorPage = lazy(() =>
  import("@kotonosora/qr-generator").then((module) => ({
    default: module.QRGeneratorPage,
  })),
);

export const middleware: MiddlewareFunction[] = [qrGeneratorMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const i18nContent = context.get(I18nReactRouterContext);
  const qrGeneratorContent = context.get(qrGeneratorMiddlewareContext);
  return { ...generalInformation, ...i18nContent, ...qrGeneratorContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description, language } = loaderData;
  return generateMetaTags({ title, description, language });
}

export default function Page({}: Route.ComponentProps) {
  return (
    <main className="min-h-svh bg-background content-visibility-auto">
      {/* Header navigation */}
      <HeaderNavigation />

      <QRGeneratorPage
        isProd={import.meta.env.PROD}
        trackingId={import.meta.env.VITE_GOOGLE_ANALYTIC_TRACKING_ID}
      />

      {/* Footer section */}
      <FooterSection />
    </main>
  );
}
