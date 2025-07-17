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
      className="py-24 px-4 bg-background relative overflow-hidden"
      style={{ contentVisibility: "auto" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:80px_80px]" />

      <div className="container mx-auto relative">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-green-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 animate-pulse">
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
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background via-background to-primary/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                Type Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base leading-relaxed">
                End-to-end TypeScript coverage with proper route typing and
                strict type checking throughout the entire stack.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background via-background to-yellow-500/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <CardTitle className="text-xl group-hover:text-yellow-600 transition-colors">
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base leading-relaxed">
                Modern tooling with Vite and Bun for lightning-fast builds, plus
                Cloudflare edge deployment for global performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background via-background to-green-500/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
                Developer Ergonomics
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base leading-relaxed">
                Opinionated setup that just works. Pre-configured tooling,
                testing, and development environment for maximum productivity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-background via-background to-purple-500/5 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="pb-4 relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                Versatile
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <CardDescription className="text-base leading-relaxed">
                Flexible architecture designed to fit the majority of project
                ideas, from MVPs to production applications.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-primary/20 rounded-full animate-bounce delay-1000" />
        <div className="absolute top-40 right-20 w-6 h-6 bg-green-500/20 rounded-full animate-bounce delay-1500" />
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-yellow-500/20 rounded-full animate-bounce delay-2000" />
        <div className="absolute bottom-32 right-10 w-5 h-5 bg-purple-500/20 rounded-full animate-bounce delay-2500" />
      </div>
    </section>
  );
});
