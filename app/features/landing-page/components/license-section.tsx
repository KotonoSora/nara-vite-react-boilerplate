import { Shield, Sparkles } from "lucide-react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function LicenseSection({
  githubRepository,
  commercialLink,
}: {
  githubRepository: string;
  commercialLink?: string;
}) {
  return (
    <section className="py-16 px-6 lg:px-24 bg-gradient-to-br from-muted/40 to-primary/5">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full text-sm font-medium text-green-600 dark:text-green-400 mb-6">
          <Shield className="h-4 w-4" />
          Open Source & Commercial
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          🚀 Licensing Options
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Open Source Card */}
          <Card className="text-left border-2 border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-sm bg-primary/10 border-primary/20"
                >
                  AGPL-3.0
                </Badge>
                <span className="text-2xl font-bold text-green-500">Free</span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Open Source</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Perfect for open source projects and learning
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Use, modify, and deploy freely
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Full source code access
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  Must open source if deployed publicly
                </li>
              </ul>

              <Button variant="outline" className="w-full" asChild>
                <Link
                  to={githubRepository}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get Started Free"
                >
                  Get Started Free
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Commercial Card */}
          <Card className="text-left border-2 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 bg-gradient-to-br from-background to-purple-500/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                  Commercial License
                </Badge>
                <span className="text-2xl font-bold text-purple-500">
                  One-time
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Commercial Edition
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Great for closed-source and production SaaS projects
                </p>
              </div>

              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  No need to open source your changes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  One-time payment per version
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                  Distributed via Gumroad
                </li>
              </ul>

              {commercialLink ? (
                <Button variant="default" className="w-full" asChild>
                  <Link
                    to={commercialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Get Commercial License"
                  >
                    Get Commercial License
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full opacity-80 cursor-not-allowed"
                  disabled
                >
                  Coming Soon
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
