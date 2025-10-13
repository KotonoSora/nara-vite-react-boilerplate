import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import type { ProjectInfo } from "../types/type";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export function BuiltInDemoItem({ project }: { project: ProjectInfo }) {
  return (
    <Card className="overflow-hidden py-0 gap-0 content-visibility-auto">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-primary">{project.name}</h3>
          <Button variant="default" size="icon" className="shrink-0" asChild>
            <Link to={project.url} aria-label={`View ${project.name}`}>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs border-primary/30 text-primary"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
