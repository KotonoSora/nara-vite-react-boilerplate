import {
  ArrowRight,
  Code,
  ExternalLink,
  Layers,
  Rocket,
  Shield,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { GitHubButton } from "./components/github-button";
import { LicenseSection } from "./components/license-section";
import { ShowcaseSection } from "./components/showcase";

export function ContentPage({
  githubRepository,
  commercialLink,
  showcases,
}: PageInformation) {
  return (
    <div className="min-h-screen bg-background relative overflow-visible">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />

      {/* Header/Navigation */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between mx-auto px-2">
          <div className="flex items-center space-x-2">
            <img
              src="assets/logo-dark.svg"
              alt=""
              className="w-8 h-8 hidden [html.dark_&]:block"
            />
            <img
              src="assets/logo-light.svg"
              alt=""
              className="w-8 h-8 hidden [html.light_&]:block"
            />
            <h1 className="text-xl font-bold">NARA</h1>
          </div>
          <div className="flex items-center space-x-2">
            <GitHubButton githubRepository={githubRepository} />
            <ModeSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 bg-background relative">
        <div className="container mx-auto text-center">
          <div className="mx-auto max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-6 animate-pulse">
              <Star className="h-4 w-4 fill-current" />
              Production-Ready Boilerplate
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              NARA Boilerplate
            </h1>

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

      {/* Built for Developers Section */}
      <section className="py-16 px-4 bg-muted/30 relative">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-primary/10 border border-purple-500/20 rounded-full text-sm font-medium text-purple-600 dark:text-purple-400 mb-6">
              <Code className="h-4 w-4" />
              Built for Developers Who Ship
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need, Nothing You Don't
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card border-2 border-primary/60 rounded-xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">5min</div>
                  <div className="text-sm text-muted-foreground">
                    Setup time
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-700">100%</div>
                  <div className="text-sm text-muted-foreground">Type-safe</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-500">0</div>
                  <div className="text-sm text-muted-foreground">
                    Config headaches
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 px-4 bg-background">
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
                  Modern tooling with Vite and Bun for lightning-fast builds,
                  plus Cloudflare edge deployment for global performance.
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

      {/* Tech Stack Section */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-6">
              <Zap className="h-4 w-4" />
              Modern Stack
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Carefully selected technologies that work seamlessly together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-background/60 to-blue-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Frontend
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">React</span>
                    <span className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                      19.1.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">TypeScript</span>
                    <span className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                      5.8.3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">React Router</span>
                    <span className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                      7.6.3
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-background/60 to-purple-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Styling
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">TailwindCSS</span>
                    <span className="text-sm text-muted-foreground bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded">
                      4.1.11
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">shadcn/ui</span>
                    <span className="text-sm text-muted-foreground bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded">
                      Latest
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Radix UI + Lucide</span>
                    <span className="text-sm text-muted-foreground bg-purple-500/10 border border-purple-500/20 px-2 py-1 rounded">
                      Icons
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-gradient-to-br from-background/60 to-green-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Backend
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hono Framework</span>
                    <span className="text-sm text-muted-foreground bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                      Fast
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Workers</span>
                    <span className="text-sm text-muted-foreground bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                      Edge
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Serverless</span>
                    <span className="text-sm text-muted-foreground bg-green-500/10 border border-green-500/20 px-2 py-1 rounded">
                      Ready
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500/20 bg-gradient-to-br from-background/60 to-orange-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Database
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare D1</span>
                    <span className="text-sm text-muted-foreground bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                      SQLite
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Drizzle ORM</span>
                    <span className="text-sm text-muted-foreground bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                      Type-safe
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Edge Database</span>
                    <span className="text-sm text-muted-foreground bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded">
                      Global
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/20 bg-gradient-to-br from-background/60 to-red-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Tooling
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bun Runtime</span>
                    <span className="text-sm text-muted-foreground bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                      Fast
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Vite</span>
                    <span className="text-sm text-muted-foreground bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                      Build
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Vitest</span>
                    <span className="text-sm text-muted-foreground bg-red-500/10 border border-red-500/20 px-2 py-1 rounded">
                      Testing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-background/60 to-cyan-500/5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl flex items-center gap-2">
                  Deployment
                  <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Pages</span>
                    <span className="text-sm text-muted-foreground bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                      Frontend
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Workers</span>
                    <span className="text-sm text-muted-foreground bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                      Backend
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Edge Network</span>
                    <span className="text-sm text-muted-foreground bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded">
                      Global
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* License */}
      <LicenseSection
        githubRepository={githubRepository}
        commercialLink={commercialLink}
      />

      {/* Showcase */}
      <ShowcaseSection showcases={showcases} />

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <img
                src="assets/logo-dark.svg"
                alt=""
                className="w-8 h-8 hidden [html.dark_&]:block"
              />
              <img
                src="assets/logo-light.svg"
                alt=""
                className="w-8 h-8 hidden [html.light_&]:block"
              />
              <h3 className="text-2xl font-bold">NARA</h3>
            </div>
            <p className="text-muted-foreground">
              The Full-Stack React Boilerplate That Actually Ships
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 NARA Boilerplate. Built with ❤️ by KotonoSora — to help you
            ship faster and with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
