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

  const canonicalUrl =
    import.meta.env.VITE_PROD_DOMAIN || import.meta.env.VITE_DEV_DOMAIN;
  const siteName = "KotonoSora";
  const locale = "en_US";
  const language = "en-US";
  const socialImage = canonicalUrl + "/assets/png/social-media.png";
  const fallbackSocialImage = SocialPreview;
  const imageContent = socialImage ?? fallbackSocialImage;
  const twitterHandle = "@kotonosora";
  const modifiedTime = "2025-01-01T00:00:00+00:00";
  const publisherUrl = "@kotonosora";

  return [
    { charSet: "utf-8" },
    { title },
    { name: "description", content: description },
    { name: "language", content: language },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    {
      name: "robots",
      content:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { property: "og:locale", content: locale },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: siteName },
    {
      property: "article:publisher",
      content: publisherUrl,
    },
    { property: "article:modified_time", content: modifiedTime },
    { property: "og:image", content: imageContent },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
    { property: "og:image:type", content: "image/png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:site", content: twitterHandle },
    { name: "twitter:image", content: imageContent },
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
