import { ArrowUp, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg?url";

import { usePageContext } from "./context/page-context";

export function ContentShowcasePage() {
  const { showcases, openDetail } = usePageContext();

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="min-h-screen bg-background px-4 py-8"
      style={{ contentVisibility: "auto" }}
    >
      <div className="flex justify-between items-center mb-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/">
              <ArrowUp className="w-4 h-4 rotate-270" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Showcases</h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcases.map((project) => (
          <Card
            key={project.id}
            className="flex flex-col pt-0 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              openDetail(project);
            }}
          >
            <img
              src={project.image ?? SocialPreview}
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
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 grow">
              <p className="text-sm text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
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

      {showScroll && (
        <Button
          variant="secondary"
          className="fixed bottom-4 right-4 rounded-full p-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </main>
  );
}
