import { Layers, Rocket, Shield, Wrench, Zap } from "lucide-react";
import { memo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const KeyFeaturesSection = memo(function KeyFeaturesSection() {
  return (
    <section
      className="py-24 px-4 bg-background"
      style={{ contentVisibility: "auto" }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
            <Rocket className="h-4 w-4" />
            Why Choose NARA
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Production-Ready Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built with focus on type safety, performance, and developer
            ergonomics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-background to-primary/5">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Type Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                End-to-end TypeScript coverage with proper route typing and
                strict type checking throughout the entire stack.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-background to-yellow-500/5">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Modern tooling with Vite and Bun for lightning-fast builds, plus
                Cloudflare edge deployment for global performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-background to-green-500/5">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Developer Ergonomics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Opinionated setup that just works. Pre-configured tooling,
                testing, and development environment for maximum productivity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br from-background to-purple-500/5">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Versatile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Flexible architecture designed to fit the majority of project
                ideas, from MVPs to production applications.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
});
