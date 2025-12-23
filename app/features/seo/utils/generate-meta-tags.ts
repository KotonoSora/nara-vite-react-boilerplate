import type {
  GenerateMetaTagsParams,
  GenerateMetaTagsResponse,
} from "../types/generate-meta-tags";

import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { DEFAULT_LANGUAGE } from "~/lib/i18n/constants/common";

import {
  author,
  keywords,
  modifiedTime,
  publisherUrl,
  siteName,
  twitterHandle,
} from "../constants/common";

export function generateMetaTags({
  title = import.meta.env.VITE_LANDING_PAGE_TITLE,
  description = import.meta.env.VITE_LANDING_PAGE_DESCRIPTION,
  language = DEFAULT_LANGUAGE,
}: GenerateMetaTagsParams): GenerateMetaTagsResponse {
  const canonicalUrl =
    import.meta.env.CLOUDFLARE_ENV === "production"
      ? import.meta.env.VITE_PROD_DOMAIN
      : import.meta.env.VITE_DEV_DOMAIN;

  const locale = "en_US";
  const socialImage = canonicalUrl + "/assets/png/social-media.png";
  const fallbackSocialImage = SocialPreview;
  const imageContent = socialImage ?? fallbackSocialImage;

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
    { name: "keywords", content: keywords },
    { name: "author", content: author },
  ];
}
