import { memo } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import GitHubLogoDark from "~/features/landing-page/assets/github-invertocat-dark.svg?url";
import GitHubLogoLight from "~/features/landing-page/assets/github-invertocat-light.svg?url";
import { usePageContext } from "~/features/landing-page/context/page-context";

export const GitHubButton = memo(function GitHubButton() {
  const { githubRepository } = usePageContext();

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0 cursor-pointer"
      asChild
    >
      <Link
        to={githubRepository}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3"
        aria-label="See More"
      >
        <img
          src={GitHubLogoLight}
          alt=""
          className="w-4 h-4 hidden [html.dark_&]:block"
          loading="lazy"
        />
        <img
          src={GitHubLogoDark}
          alt=""
          className="w-4 h-4 hidden [html.light_&]:block"
          loading="lazy"
        />
      </Link>
    </Button>
  );
});
