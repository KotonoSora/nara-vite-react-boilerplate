import { type FC } from "react";
import { ExternalLink, GitBranch, Plus } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { useI18n } from "~/lib/i18n";

export const RoadmapHero: FC = () => {
  const { t } = useI18n();

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

      <div className="max-w-4xl mx-auto text-center relative">
        {/* Badge */}
        <Badge 
          variant="outline" 
          className="mb-6 text-sm px-4 py-2 bg-primary/10 border-primary/20"
        >
          <GitBranch className="w-4 h-4 mr-2" />
          {t("roadmap.hero.subtitle")}
        </Badge>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          {t("roadmap.hero.title")}
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          {t("roadmap.hero.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <a
              href="https://github.com/KotonoSora/nara-vite-react-boilerplate"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              {t("roadmap.hero.contributeButton")}
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a
              href="https://github.com/KotonoSora/nara-vite-react-boilerplate/issues/new/choose"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("roadmap.hero.requestFeatureButton")}
            </a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-2">10+</div>
            <div className="text-sm text-muted-foreground">Production Features</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <div className="text-sm text-muted-foreground">In Development</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">5+</div>
            <div className="text-sm text-muted-foreground">Planned Features</div>
          </div>
        </div>
      </div>
    </section>
  );
};