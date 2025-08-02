import { Form, Link } from "react-router";

import { ModeSwitcher } from "~/components/mode-switcher";
import { Button } from "~/components/ui/button";
import { useOptionalAuth } from "~/features/auth/hooks/use-auth";

export function Navigation() {
  const auth = useOptionalAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">NARA</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            <Link
              to="/showcase"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Showcase
            </Link>
            {auth?.isAuthenticated && (
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <ModeSwitcher />

          {auth?.isAuthenticated ? (
            <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </header>
  );
}
