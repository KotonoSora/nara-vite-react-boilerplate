import { ExternalLink, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link, useFetcher } from "react-router";

import type { ProjectInfo } from "~/features/showcases/types/type";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { useAuth } from "~/lib/authentication/hooks/use-auth";
import { useTranslation } from "~/lib/i18n/hooks/use-translation";
import { cn } from "~/lib/utils";

/**
 * Renders a showcase card with voting actions and external project link.
 */
export function ShowcaseItem({
  project,
  onItemClick,
}: {
  project: ProjectInfo;
  onItemClick: (project: ProjectInfo) => void;
}) {
  const fetcher = useFetcher();
  const { user, isAuthenticated } = useAuth();
  const t = useTranslation();

  const isSubmitting = fetcher.state !== "idle";

  const handleVote =
    (value: -1 | 1) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (!user?.id || !project.id) return;

      const fd = new FormData();
      fd.append("showcaseId", String(project.id));
      fd.append("userId", String(user.id));
      fd.append("value", String(value));

      fetcher.submit(fd, { method: "post", action: "/action/showcase/vote" });
    };

  return (
    <Card
      className="overflow-hidden py-0 gap-0 content-visibility-auto cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onItemClick(project)}
    >
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
              aria-label={t("showcase.showcase.visitShowcase")}
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

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn("h-9 gap-1 cursor-pointer")}
              disabled={!isAuthenticated || isSubmitting}
              onClick={handleVote(1)}
              aria-pressed={project.userVote === 1}
              aria-label={t("showcase.showcase.upvote")}
            >
              {project.userVote === 1 ? (
                <ThumbsUp className="h-4 w-4" fill="" />
              ) : (
                <ThumbsUp className="h-4 w-4" />
              )}
              <span className="font-mono text-sm">{project.upvotes ?? 0}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className={cn("h-9 gap-1 cursor-pointer")}
              disabled={!isAuthenticated || isSubmitting}
              onClick={handleVote(-1)}
              aria-pressed={project.userVote === -1}
              aria-label={t("showcase.showcase.downvote")}
            >
              {project.userVote === -1 ? (
                <ThumbsDown className="h-4 w-4" fill="" />
              ) : (
                <ThumbsDown className="h-4 w-4" />
              )}
              <span className="font-mono text-sm">
                {project.downvotes ?? 0}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
