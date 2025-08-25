import {
  Database,
  Palette,
  Rocket,
  Shield,
  Smartphone,
  Upload,
} from "lucide-react";
import { Link } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function ShadcnAbout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center">
      <header className="w-full py-12 text-center bg-gradient-to-b from-primary/10 to-background">
        <h1 className="text-4xl font-bold mb-4">About KotonoSora</h1>
        <p className="text-lg max-w-2xl mx-auto">
          Building tools to help developers ship fast, reliable, and type-safe
          apps with confidence.
        </p>
      </header>

      <section className="w-full max-w-5xl px-4 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Why Use NARA Boilerplate?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6" /> Fast SSR
              </CardTitle>
            </CardHeader>
            <CardContent>
              Server-side rendering with React Router v7 for quick loads and
              SEO-friendly pages.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" /> Type Safety
              </CardTitle>
            </CardHeader>
            <CardContent>
              End-to-end TypeScript strict mode with auto-generated route types.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-6 w-6" /> Modern Styling
              </CardTitle>
            </CardHeader>
            <CardContent>
              TailwindCSS and shadcn/ui for responsive, dark-mode-ready UI.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" /> Database Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              Cloudflare D1 with Drizzle ORM for type-safe database queries.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-6 w-6" /> Easy Deployment
              </CardTitle>
            </CardHeader>
            <CardContent>
              Edge-first deployment with Cloudflare Workers and CI/CD pipelines.
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-6 w-6" /> Flexible Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              Add custom features easily while maintaining type safety and
              structure.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="w-full py-12 bg-muted text-center">
        <h2 className="text-3xl font-semibold mb-4">Our Story</h2>
        <p className="max-w-3xl mx-auto text-lg">
          KotonoSora started with a mission to simplify full-stack development,
          combining modern tools like React, TypeScript, and Cloudflare to
          empower developers to build scalable apps effortlessly.
        </p>
      </section>

      <footer className="py-8 text-center">
        <Link
          to="#"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Get in Touch
        </Link>
      </footer>
    </div>
  );
}
