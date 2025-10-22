import { ArrowRight, ExternalLink, Rocket, Sparkles, Star } from "lucide-react";
import { Link, useLoaderData } from "react-router";

import type { GeneralInformationType } from "~/features/shared/types/type";

import { Button } from "~/components/ui/button";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

import { heroDecorationConfig } from "../constants/background-decoration";
import { BackgroundDecoration } from "./background-decoration";

export function HeroSection() {
  const t = useTranslation();
  const { githubRepository } = useLoaderData<GeneralInformationType>();

  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-3xl opacity-20"
        aria-hidden="true"
      />

      <div className="container mx-auto text-center relative">
        <div className="mx-auto max-w-5xl">
          {/* Badge with better animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 backdrop-blur-sm">
            <Star className="h-4 w-4 fill-current" />
            {t("landing.hero.badge")}
            <Sparkles className="h-4 w-4" />
          </div>

          {/* Title with better gradient */}
          <h2 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
            {t("landing.hero.title")}
          </h2>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl font-semibold text-primary mb-4">
            {t("landing.hero.subtitle")}
          </p>

          {/* Description - reduced size/width so H2 becomes LCP */}
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("landing.hero.description")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="text-lg px-8 h-12 leading-none box-border transition-none bg-gradient-to-r from-primary to-purple-600"
              asChild
            >
              <Link
                to={githubRepository ?? ""}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 leading-none"
                aria-label={t("landing.hero.starOnGitHub")}
              >
                <Star className="h-5 w-5 align-middle" />
                {t("landing.hero.starOnGitHub")}
                <ExternalLink className="h-4 w-4 align-middle" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 h-12"
              asChild
            >
              <Link
                to={`${githubRepository}/blob/main/docs/PROJECT_OVERVIEW.md#-quick-start`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
                aria-label={t("landing.hero.quickStart")}
              >
                <Rocket className="h-5 w-5" />
                {t("landing.hero.quickStart")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Status indicator */}
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {t("landing.hero.statusText")}
            </div>
          </div>

          {/* Floating elements for visual interest */}
          <BackgroundDecoration elements={heroDecorationConfig} />
        </div>
      </div>
    </section>
  );
}
