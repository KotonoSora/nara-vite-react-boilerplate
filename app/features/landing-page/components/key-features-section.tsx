import { Rocket } from "lucide-react";
import { useLoaderData } from "react-router";

import type { PageInformation } from "../types/type";

import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { keyFeaturesDecorationConfig } from "../constants/background-decoration";
import { BackgroundDecoration } from "./background-decoration";
import { FeatureCard } from "./feature-card";

export function KeyFeaturesSection() {
  const t = useTranslation();
  const { featuresConfig } = useLoaderData<PageInformation>();

  if (!featuresConfig) return null;

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden content-visibility-auto">
      {/* Background decoration */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grid-white/[0.02] bg-[size:80px_80px]"
        aria-hidden="true"
      />

      <div className="container mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Rocket className="h-4 w-4" />
            {t("landing.features.badge")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent leading-tight sm:leading-snug md:leading-normal">
            {t("landing.features.sectionTitle")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("landing.features.sectionDescription")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.isArray(featuresConfig) &&
            featuresConfig.map((feature) => (
              <FeatureCard key={feature.title} config={feature} />
            ))}
        </div>

        {/* Floating background elements */}
        <BackgroundDecoration elements={keyFeaturesDecorationConfig} />
      </div>
    </section>
  );
}
