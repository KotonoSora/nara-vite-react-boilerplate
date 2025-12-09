import type { Route } from "./+types/($lang).showcases.qr-generator";

import type { MiddlewareFunction } from "react-router";

import {
  qrGeneratorMiddleware,
  qrGeneratorMiddlewareContext,
} from "~/features/showcases-qr-generator/middleware/qr-generator-middleware";
import { QRGeneratorPage } from "~/features/showcases-qr-generator/page";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [qrGeneratorMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const qrGeneratorContent = context.get(qrGeneratorMiddlewareContext);
  return { ...generalInformation, ...qrGeneratorContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [{ title }, { name: "description", content: description }];
}

export default function Page({}: Route.ComponentProps) {
  return <QRGeneratorPage />;
}
