import { memo } from "react";
import { Form, Link } from "react-router";

import { LanguageSwitcher } from "~/components/language-switcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { useOptionalAuth } from "~/features/auth/hooks/use-auth";
import { GitHubButton } from "~/features/landing-page/components/github-button";

export const HeaderNavigationSection = memo(function HeaderNavigationSection() {
  const auth = useOptionalAuth();

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between mx-auto px-2">
        <div className="flex items-center space-x-2">
          <Link
            to="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/logo-dark.svg"
              alt=""
              className="w-8 h-8 hidden [html.dark_&]:block"
              loading="lazy"
            />
            <img
              src="/assets/logo-light.svg"
              alt=""
              className="w-8 h-8 hidden [html.light_&]:block"
              loading="lazy"
            />
            <h2 className="text-xl font-bold">NARA</h2>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {auth?.isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {auth.user?.name}
              </span>
              <Form method="post" action="/action/logout">
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
          <GitHubButton />
          <LanguageSwitcher />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
});
