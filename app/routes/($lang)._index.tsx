import type { Route } from "./+types/($lang)._index";

import type { MiddlewareFunction } from "react-router";

import {
  landingPageMiddleware,
  landingPageMiddlewareContext,
} from "~/features/landing-page/middleware/landing-page-middleware";
import { ContentPage } from "~/features/landing-page/page";
import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { GeneralInformationContext } from "~/middleware/information";

export const middleware: MiddlewareFunction[] = [landingPageMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const generalInformation = context.get(GeneralInformationContext);
  const pageContent = context.get(landingPageMiddlewareContext);
  return { ...generalInformation, ...pageContent };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { title, description } = loaderData;
  return [
    { title },
    { name: "description", content: description },
    // Meta tags for SEO and Social Media
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { property: "og:image", content: SocialPreview },
    { name: "twitter:image", content: SocialPreview },
    { property: "og:type", content: "website" },
    {
      name: "keywords",
      content:
        "boilerplate, react, vite, react-router, ssr, i18n, typescript, tailwindcss",
    },
    { name: "author", content: "KotonoSora" },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return <ContentPage />;
}
