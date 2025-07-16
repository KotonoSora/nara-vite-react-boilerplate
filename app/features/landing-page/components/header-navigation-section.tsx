import { memo } from "react";
import { Link } from "react-router";

import { ModeSwitcher } from "~/components/mode-switcher";
import { GitHubButton } from "~/features/landing-page/components/github-button";

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between mx-auto px-2">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center space-x-2">
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
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            to="/pricing" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link 
            to="/dashboard" 
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <GitHubButton />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
});
