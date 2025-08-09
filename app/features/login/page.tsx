import { Link } from "react-router";

import { LoginForm } from "~/features/login/components/login-form";

import { usePageContext } from "./context/page-context";

export function ContentLoginPage() {
  const { error } = usePageContext();

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center text-xl font-bold"
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
          NARA
        </Link>
        <div className="flex flex-col gap-6">
          <LoginForm error={error} isSubmitting={false} />
          <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
