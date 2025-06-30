import { ExternalLink } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg";

export function ShowcaseSection({ showcases }: { showcases?: ProjectInfo[] }) {
  if (!showcases || showcases.length < 1) return null;

  return (
    <section className="py-16 px-6 lg:px-24 bg-background">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">🌟 Showcase</h2>
        <p className="text-muted-foreground text-sm">
          Projects proudly built with{" "}
          <code className="text-foreground">nara-vite-react-boilerplate</code>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 max-w-5xl mx-auto">
        {showcases.map((project: ProjectInfo) => (
          <Card
            key={project.id}
            className="overflow-hidden hover:shadow-xl transition-shadow py-0 gap-0"
          >
            <CardHeader className="p-0 gap-0">
              <img
                src={project.image ?? SocialPreview}
                alt={project.name}
                className="w-full h-48 object-cover border-b block"
              />
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <Button variant="ghost" size="icon" asChild>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
