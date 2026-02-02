import { trackCustomEvents } from "@kotonosora/google-analytics";
import { useTranslation } from "@kotonosora/i18n-react";
import { Button } from "@kotonosora/ui/components/ui/button";
import { Link } from "react-router";

export function DonateSection() {
  const t = useTranslation();
  const donateLink = import.meta.env.VITE_DONATE_LINK;

  if (!donateLink) return null;

  return (
    <div className="border-t bg-background py-12 text-center content-visibility-auto">
      <Button variant="link" asChild>
        <Link
          className="gumroad-button"
          to={donateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            // tracking event open donate link
            trackCustomEvents({
              isProd: import.meta.env.PROD,
              trackingId: import.meta.env.VITE_GOOGLE_ANALYTIC_TRACKING_ID,
              event: {
                event_category: "Button",
                event_label: "Click to open the Donate link",
              },
            });
          }}
        >
          {t("landing.donate.label")}
        </Link>
      </Button>
    </div>
  );
}
