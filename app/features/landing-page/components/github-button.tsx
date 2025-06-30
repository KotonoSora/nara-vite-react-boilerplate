import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import GitHubLogoDark from "~/features/landing-page/assets/GitHub_Invertocat_Dark.svg";
import GitHubLogoLight from "~/features/landing-page/assets/GitHub_Invertocat_Light.svg";

export function GitHubButton({
  githubRepository,
}: {
  githubRepository: string;
}) {
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
      >
        <img
          src={GitHubLogoLight}
          alt=""
          className="w-4 h-4 hidden [html.dark_&]:block"
        />
        <img
          src={GitHubLogoDark}
          alt=""
          className="w-4 h-4 hidden [html.light_&]:block"
        />
      </Link>
    </Button>
  );
}
