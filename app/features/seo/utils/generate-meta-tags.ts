import type {
  GenerateMetaTagsParams,
  GenerateMetaTagsResponse,
} from "../types/generate-meta-tags";

import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { DEFAULT_LANGUAGE } from "~/lib/i18n/constants/common";
import { getIntlLocaleByLanguage } from "~/lib/i18n/utils/datetime/get-intl-locale-by-language";

import {
  author,
  keywords,
  modifiedTime,
  publisherUrl,
  siteName,
  twitterHandle,
} from "../constants/common";

/**
 * Generates SEO meta tags for a page.
 *
 * Implementation notes:
 * - Computes `canonicalUrl` lazily at call time to avoid module-load env access.
 * - Falls back to a bundled social preview if domain envs are absent.
 */
export function generateMetaTags({
  title = import.meta.env.VITE_LANDING_PAGE_TITLE,
  description = import.meta.env.VITE_LANDING_PAGE_DESCRIPTION,
  language = DEFAULT_LANGUAGE,
}: GenerateMetaTagsParams): GenerateMetaTagsResponse {
  const locale = getIntlLocaleByLanguage(language);

  // Compute canonical URL at runtime to avoid module-load env dependency
  const isProd = import.meta.env.VITE_DOMAIN_ENV === "production";
  const domain = isProd
    ? import.meta.env.VITE_PROD_DOMAIN
    : import.meta.env.VITE_DEV_DOMAIN;
  const canonicalUrl = domain ?? "";

  const socialImageUrl = canonicalUrl
    ? `${canonicalUrl}/assets/png/social-media.png`
    : undefined;
  const fallbackImageUrl = SocialPreview;
  const seoImageUrl = socialImageUrl ?? fallbackImageUrl;
  const faviconHref = canonicalUrl
    ? `${canonicalUrl}/favicon.ico`
    : "/favicon.ico";

  return [
    { title },
    { name: "description", content: description },
    { name: "language", content: language },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
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
    { property: "og:image", content: seoImageUrl },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
    { property: "og:image:type", content: "image/png" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:site", content: twitterHandle },
    { name: "twitter:image", content: seoImageUrl },
    { name: "keywords", content: keywords },
    { name: "author", content: author },
    { rel: "icon", href: faviconHref, type: "image/x-icon" },
  ];
}
