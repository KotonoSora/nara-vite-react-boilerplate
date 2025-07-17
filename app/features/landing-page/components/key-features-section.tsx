import { Rocket } from "lucide-react";
import { memo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { usePageContext } from "~/features/landing-page/context/page-context";
import { getIconComponent } from "~/features/landing-page/utils/get-icon-component";

import {
  BackgroundDecoration,
  keyFeaturesDecorationConfig,
} from "./shared/background-decoration";

interface FeatureCardProps {
  config: FeatureCardConfig;
}

const FeatureCard = memo(function FeatureCard({ config }: FeatureCardProps) {
  const { icon: iconName, title, description, colors } = config;
  const Icon = getIconComponent(iconName);

  return (
    <Card
      className={`border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 motion-safe:hover:shadow-2xl motion-safe:hover:-translate-y-2 bg-gradient-to-br from-background via-background ${colors.background} group relative overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-${colors.primary}/5 to-transparent opacity-0 motion-safe:group-hover:opacity-100 transition-opacity duration-500`}
      />
      <CardHeader className="pb-4 relative">
        <div
          className={`w-12 h-12 bg-gradient-to-br from-${colors.primary}/20 to-${colors.secondary}/20 rounded-lg flex items-center justify-center mb-4 motion-safe:group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <CardTitle className={`text-xl ${colors.hover} transition-colors`}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
});

export const KeyFeaturesSection = memo(function KeyFeaturesSection() {
  const { featuresConfig } = usePageContext();
  return (
    <section
      className="py-24 px-4 bg-background relative overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 motion-safe:animate-pulse">
            <Rocket className="h-4 w-4" />
            Why Choose NARA
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Production-Ready Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built with focus on type safety, performance, and developer
            ergonomics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresConfig.map((feature) => (
            <FeatureCard key={feature.title} config={feature} />
          ))}
        </div>

        {/* Floating background elements */}
        <BackgroundDecoration elements={keyFeaturesDecorationConfig} />
      </div>
    </section>
  );
});
