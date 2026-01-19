import { useTranslation } from "@kotonosora/i18n-react";
import { ExternalLink, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { useEffect } from "react";
import { Link, useFetcher } from "react-router";

import type { ProjectInfo } from "~/features/showcases/types/type";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import SocialPreview from "~/features/shared/assets/social-preview.svg?no-inline";
import { useAuth } from "~/lib/authentication/hooks/use-auth";
import { cn } from "~/lib/utils";

interface ShowcaseDetailModalProps {
  project: ProjectInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onVoteUpdate: (
    showcaseId: string | number,
    voteData: {
      userVote?: -1 | 1;
      upvotes: number;
      downvotes: number;
      score: number;
    },
  ) => void;
}

export function ShowcaseDetailModal({
  project,
  isOpen,
  onClose,
  onVoteUpdate,
}: ShowcaseDetailModalProps) {
  const fetcher = useFetcher();
  const { user, isAuthenticated } = useAuth();

  const t = useTranslation();

  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const result = fetcher.data as {
        success?: boolean;
        vote?: {
          showcaseId: string;
          userVote?: -1 | 1;
          upvotes: number;
          downvotes: number;
          score: number;
        };
      };
      if (result.success && result.vote && project?.id) {
        onVoteUpdate(project.id, {
          userVote: result.vote.userVote,
          upvotes: result.vote.upvotes,
          downvotes: result.vote.downvotes,
          score: result.vote.score,
        });
      }
    }
  }, [fetcher.state, fetcher.data, project?.id, onVoteUpdate]);

  if (!project) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="max-w-2xl p-0 overflow-hidden"
      >
        {/* HERO */}
        <div className="relative h-64">
          <img
            src={project.image ?? SocialPreview}
            alt={project.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-3 top-3 text-white"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <h2 className="text-2xl font-semibold text-white">
              {project.name}
            </h2>

            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-white/90 text-black text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="space-y-6 p-6">
          {/* STATS */}
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
            <span className="font-mono text-sm">{project.downvotes ?? 0}</span>
          </Button>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">
              {t("showcase.showcase.descriptionLabel")}
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 border-t bg-background p-4">
          <Button asChild className="w-full">
            <Link to={project.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("showcase.showcase.visitShowcase")}
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
