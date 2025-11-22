import { ExternalLink } from "lucide-react";
import { Link } from "react-router";

import type { ProjectInfo } from "~/features/showcases/types/type";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";

export function ShowcaseItem({ project }: { project: ProjectInfo }) {
  const t = useTranslation();

  return (
    <Card className="overflow-hidden py-0 gap-0 content-visibility-auto">
      <CardHeader className="p-0 gap-0">
        <img
          src={project.image ?? SocialPreview}
          alt={project.name}
          className="w-full h-48 object-cover border-b block"
          loading="lazy"
        />
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Button variant="ghost" size="icon" asChild>
            <Link
              to={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("landing.github.seeMore")}
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
