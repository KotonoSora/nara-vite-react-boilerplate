import { ExternalLink } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg?url";

import { usePageContext } from "./context/page-context";

export function ContentShowcasePage() {
  const { showcases } = usePageContext();

  return (
    <main
      className="min-h-screen bg-background px-4 py-8"
      style={{ contentVisibility: "auto" }}
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map((project) => (
          <Card key={project.id} className="flex flex-col pt-0">
            <img
              src={project.image ?? SocialPreview}
              alt={project.name}
              className="rounded-t-xl w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{project.name}</span>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 grow">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
