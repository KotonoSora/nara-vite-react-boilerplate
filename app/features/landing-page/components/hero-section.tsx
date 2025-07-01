import { ArrowRight, ExternalLink, Rocket, Star } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { usePageContext } from "~/features/landing-page/context/page-context";

export const HeroSection = memo(function HeroSection() {
  const { githubRepository } = usePageContext();

  return (
    <section
      className="py-24 px-4 bg-background relative"
      style={{ contentVisibility: "auto" }}
    >
      <div className="container mx-auto text-center">
        <div className="mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 animate-pulse">
            <Star className="h-4 w-4 fill-current" />
            Production-Ready Boilerplate
          </div>

          <p className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
            NARA Boilerplate
          </p>

          <p className="text-2xl font-semibold text-primary mb-4">
            The Full-Stack React Boilerplate That Actually Ships
          </p>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop wasting time on boilerplate setup. Start with a
            production-ready foundation built for developers who ship fast and
            ship often.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="text-lg px-8 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-shadow duration-300 will-change-transform backface-hidden transform-gpu"
              asChild
            >
              <Link
                to={githubRepository}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                aria-label="Star on GitHub"
              >
                <Star className="h-5 w-5" />
                Star on GitHub
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-2 h-12 hover:bg-primary/5 transition-all duration-300"
              asChild
            >
              <Link
                to={`${githubRepository}/blob/main/docs/PROJECT_OVERVIEW.md#-quick-start`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
                aria-label="Quick Start"
              >
                <Rocket className="h-5 w-5" />
                Quick Start
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              From git clone to production in 5 minutes
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
