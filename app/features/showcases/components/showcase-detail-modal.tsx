import { ExternalLink, X } from "lucide-react";
import { Link } from "react-router";

import type { ProjectInfo } from "~/features/showcases/types/type";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface ShowcaseDetailModalProps {
  project: ProjectInfo | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShowcaseDetailModal({
  project,
  isOpen,
  onClose,
}: ShowcaseDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {project.image && (
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-base">Description</h3>
            <p className="text-sm text-muted-foreground">
              {project.description}
            </p>
          </div>

          {project.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-base">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-base">Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {project.upvotes ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Upvotes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {project.downvotes ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">Downvotes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{project.score ?? 0}</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button asChild className="flex-1">
              <Link to={project.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Showcase
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
