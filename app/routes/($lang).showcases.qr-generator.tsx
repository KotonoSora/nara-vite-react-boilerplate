import { generateMetaTags } from "@kotonosora/seo";

import type { Route } from "./+types/($lang).showcases.qr-generator";

import type { MiddlewareFunction } from "react-router";

import {
  qrGeneratorMiddleware,
  qrGeneratorMiddlewareContext,
} from "~/features/showcases-qr-generator/middleware/qr-generator-middleware";
import { QRGeneratorPage } from "~/features/showcases-qr-generator/page";
import { I18nReactRouterContext } from "~/middleware/i18n";
import { GeneralInformationContext } from "~/middleware/information";

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
  return <QRGeneratorPage />;
}
