import { useTranslation } from "@kotonosora/i18n-react";
import { Badge } from "@kotonosora/ui/components/ui/badge";
import { Button } from "@kotonosora/ui/components/ui/button";
import { Card, CardContent } from "@kotonosora/ui/components/ui/card";
import { Shield } from "lucide-react";
import { Link, useLoaderData } from "react-router";

import type { GeneralInformationType } from "~/features/shared/types/type";

import { trackCustomEvents } from "~/features/google-analytics/utils/track-custom-events";

export function LicenseSection() {
  const t = useTranslation();
  const { githubRepository, commercialLink } =
    useLoaderData<GeneralInformationType>();

  return (
    <section className="py-16 px-6 lg:px-24 bg-linear-to-br from-muted/40 to-primary/5 content-visibility-auto">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400 mb-6">
          <Shield className="h-4 w-4" />
          {t("landing.license.badge")}
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          {t("landing.license.title")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          {/* Open Source Card */}
          <Card className="text-left border-2 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-sm bg-primary/10 border-primary/20"
                >
                  {t("landing.license.openSource.badge")}
                </Badge>
                <span className="text-2xl font-bold text-green-700">
                  {t("landing.license.openSource.price")}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("landing.license.openSource.title")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("landing.license.openSource.description")}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {t("landing.license.openSource.features.useFreely")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  {t("landing.license.openSource.features.fullSource")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  {t("landing.license.openSource.features.mustOpenSource")}
                </li>
              </ul>

              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={githubRepository ?? ""}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("landing.license.openSource.button")}
                  onClick={() => {
                    // tracking event open open source
                    trackCustomEvents({
                      event_category: "Button",
                      event_label: "Click to open the Open Source link",
                    });
                  }}
                >
                  {t("landing.license.openSource.button")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Commercial Card */}
          <Card className="text-left border-2 border-purple-500/20 bg-linear-to-br from-background to-purple-500/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="text-sm bg-linear-to-r from-purple-500 to-pink-500 text-white border-none">
                  {t("landing.license.commercial.badge")}
                </Badge>
                <span className="text-2xl font-bold text-purple-500">
                  {t("landing.license.commercial.price")}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {t("landing.license.commercial.title")}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("landing.license.commercial.description")}
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  {t("landing.license.commercial.features.noOpenSource")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  {t("landing.license.commercial.features.oneTime")}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  {t("landing.license.commercial.features.gumroad")}
                </li>
              </ul>

              {commercialLink ? (
                <Button variant="default" className="w-full" asChild>
                  <Link
                    to={commercialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("landing.license.commercial.button")}
                    onClick={() => {
                      // tracking event open commercial
                      trackCustomEvents({
                        event_category: "Button",
                        event_label: "Click to open the Commercial link",
                      });
                    }}
                  >
                    {t("landing.license.commercial.button")}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full opacity-80 cursor-not-allowed"
                  disabled
                >
                  {t("landing.license.commercial.comingSoon")}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
