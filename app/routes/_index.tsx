import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

import type { Route } from "./+types/_index";

import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "NARA Boilerplate - Production-Ready React Starter" },
    {
      name: "description",
      content:
        "Fast, opinionated starter template for building full-stack React apps with modern tooling and Cloudflare Workers deployment.",
    },
  ];
}

export default function Page({}: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-2">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold">NARA</h1>
          </div>
          <ModeSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-24 px-4">
        <div className="absolute inset-0 bg-muted" />
        <div className="container mx-auto text-center relative">
          <div className="mx-auto max-w-4xl">
            <div className="inline-block px-4 py-2 bg-accent border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              ✨ Production-Ready Boilerplate
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              NARA Boilerplate
            </h1>
            <p className="text-2xl font-semibold text-muted-foreground mb-4">
              Non-Abstract Reusable App
            </p>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              A fast, opinionated starter template for building full-stack React
              apps. Production-ready with modern tooling, designed to fit the
              majority of your project ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link
                  to="https://github.com/KotonoSora/nara-vite-react-boilerplate"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  View on GitHub <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-4 py-2 bg-accent border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              🚀 Why Choose NARA
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
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 bg-primary rounded-sm"></div>
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

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/70 rounded-sm"></div>
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

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
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

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-lg"></div>
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
            <div className="inline-block px-4 py-2 bg-accent border border-primary/20 rounded-full text-sm font-medium text-primary mb-6">
              ⚡ Modern Stack
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Modern Tech Stack
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Carefully selected technologies that work seamlessly together
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <div className="w-6 h-6 bg-blue-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">React</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      19.1.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">TypeScript</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      5.8.3
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">React Router</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      7.6.2
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <div className="w-6 h-6 bg-purple-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Styling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">TailwindCSS</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      4.1.10
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">shadcn/ui</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Latest
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Radix UI + Lucide</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Icons
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                  <div className="w-6 h-6 bg-green-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Backend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hono Framework</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Fast
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Workers</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Edge
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Serverless</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Ready
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                  <div className="w-6 h-6 bg-orange-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Database</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare D1</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      SQLite
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Drizzle ORM</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Type-safe
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Edge Database</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Global
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                  <div className="w-6 h-6 bg-red-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Tooling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Bun Runtime</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Fast
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Vite</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Build
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Vitest</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Testing
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 hover:-translate-y-1 bg-background/60 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <div className="w-6 h-6 bg-cyan-500 rounded-sm"></div>
                </div>
                <CardTitle className="text-xl">Deployment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Pages</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Frontend
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Cloudflare Workers</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Backend
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Edge Network</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                      Global
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-background">
        <div className="container mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">NARA</h3>
            <p className="text-muted-foreground">Non-Abstract Reusable App</p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 NARA Boilerplate. Built for developers who ship fast with
            confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
