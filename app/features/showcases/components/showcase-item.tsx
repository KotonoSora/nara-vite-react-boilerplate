import { ExternalLink } from "lucide-react";

import type { ProjectInfo } from "../types/type";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useI18n } from "~/lib/i18n";

export function ShowcaseItem({ project }: { project: ProjectInfo }) {
  const { t } = useI18n();

  return (
    <Card className="flex flex-col pt-0 hover:shadow-lg transition-shadow cursor-pointer">
      <img
        src={project.image}
        alt={project.name}
        className="rounded-t-xl w-full h-48 object-cover"
        loading="lazy"
      />
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{project.name}</span>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground"
            onClick={(e) => e.stopPropagation()}
            aria-label={t("showcase.viewProject")}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 grow">
        <p className="text-sm text-muted-foreground">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(project.tags) &&
            project.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
