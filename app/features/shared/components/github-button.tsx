import { useTranslation } from "@kotonosora/i18n-react";
import { Link, useLoaderData } from "react-router";

import type { GeneralInformationType } from "../types/type";

import { Button } from "~/components/ui/button";
import { trackCustomEvents } from "~/features/google-analytics/utils/track-custom-events";

import GitHubLogoDark from "../assets/github-invertocat-dark.svg?no-inline";
import GitHubLogoLight from "../assets/github-invertocat-light.svg?no-inline";

export function GitHubButton() {
  const t = useTranslation();
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
        onClick={() => {
          // tracking event open open source
          trackCustomEvents({
            event_category: "Button",
            event_label: "Click to open the Open Source link",
          });
        }}
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
