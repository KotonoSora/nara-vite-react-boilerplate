import clsx from "clsx";
import { ArrowUp, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SocialPreview from "~/features/landing-page/assets/social-preview.svg?url";
import { FooterSection } from "~/features/landing-page/components/footer-section";
import { HeaderNavigationSection } from "~/features/landing-page/components/header-navigation-section";

import { usePageContext } from "./context/page-context";

export function ContentShowcasePage() {
  const { showcases } = usePageContext();

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onScroll = () => setShowScroll(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleScrollToTop = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main
        className="min-h-screen bg-background"
        style={{ contentVisibility: "auto" }}
      >
        {/* Header/Navigation Section */}
        <HeaderNavigationSection />

        <div className="flex justify-between items-center max-w-6xl mx-auto my-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <ArrowUp className="w-4 h-4 rotate-270" />
              </Link>
            </Button>
            <h1 className="text-xl font-semibold">Showcases</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto my-6 px-3">
          {showcases.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col pt-0 hover:shadow-lg transition-shadow cursor-pointer"
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

        {/* Footer Section */}
        <FooterSection />
      </main>

      <Button
        className={clsx("z-10 fixed bottom-4 right-4 rounded-full w-8 h-8", {
          visible: showScroll,
          invisible: !showScroll,
        })}
        onClick={handleScrollToTop}
      >
        <ArrowUp size={20} />
      </Button>
    </>
  );
}
