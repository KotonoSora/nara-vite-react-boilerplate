import { Zap } from "lucide-react";
import { memo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useI18n } from "~/lib/i18n";

export const TechStackSection = memo(function TechStackSection() {
  const { t } = useI18n();

  return (
    <section
      className="py-24 px-4 bg-muted/20"
      style={{ contentVisibility: "auto" }}
    >
      <div className="container mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-sm font-medium text-cyan-600 dark:text-cyan-400 mb-6">
            <Zap className="h-4 w-4" />
            {t("landing.techStack.badge")}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            {t("landing.techStack.title")}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t("landing.techStack.description")}
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
                    19.1.1
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">TypeScript</span>
                  <span className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                    5.9.2
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">React Router</span>
                  <span className="text-sm text-muted-foreground bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                    7.7.1
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
  );
});
