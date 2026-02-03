import type { JSX } from "react";

/**
 * Inserts Google Analytics tracking scripts into the document head.
 *
 * This component conditionally renders the necessary `<script>` tags for Google Analytics
 * tracking based on the current environment and the presence of a tracking ID.
 *
 * - Only renders in production (`isProd`).
 * - Uses the tracking ID from `trackingId`.
 * - If the tracking ID is not set, renders nothing.
 * - Loads the Google Analytics library asynchronously.
 * - Initializes the `dataLayer` and configures Google Analytics with `send_page_view: false`.
 *
 * @returns {JSX.Element | null} The script tags for Google Analytics, or `null` if not in production or tracking ID is missing.
 */
export function HeadScriptTrackingTag({
  isProd,
  trackingId,
}: {
  isProd: boolean;
  trackingId: string | undefined;
}): JSX.Element | null {
  if (!isProd || !trackingId) return null;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${trackingId}', { send_page_view: false });
            `,
        }}
      />
    </>
  );
}
