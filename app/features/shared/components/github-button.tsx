import { Link, useLoaderData } from "react-router";

import type { GeneralInformationType } from "../types/type";

import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n/context";

import GitHubLogoDark from "../assets/github-invertocat-dark.svg?url";
import GitHubLogoLight from "../assets/github-invertocat-light.svg?url";

export function GitHubButton() {
  const { t } = useI18n();
  const { githubRepository } = useLoaderData<GeneralInformationType>();

  return (
    <Button
      variant="ghost"
      className="group/toggle h-8 w-8 px-0 cursor-pointer"
      asChild
    >
      <Link
        to={githubRepository ?? ""}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3"
        aria-label={t("landing.github.seeMore")}
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
}
