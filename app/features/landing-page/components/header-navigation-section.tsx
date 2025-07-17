import { memo } from "react";

import { ModeSwitcher } from "~/components/mode-switcher";
import { LanguageSwitcher } from "~/components/language-switcher";
import { GitHubButton } from "~/features/landing-page/components/github-button";

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between mx-auto px-2">
        <div className="flex items-center space-x-2">
          <img
            src="assets/logo-dark.svg"
            alt=""
            className="w-8 h-8 hidden [html.dark_&]:block"
            loading="lazy"
          />
          <img
            src="assets/logo-light.svg"
            alt=""
            className="w-8 h-8 hidden [html.light_&]:block"
            loading="lazy"
          />
          <h1 className="text-xl font-bold">NARA</h1>
        </div>
        <div className="flex items-center space-x-2">
          <GitHubButton />
          <LanguageSwitcher />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
});
