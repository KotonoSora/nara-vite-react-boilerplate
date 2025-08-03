import { LoginForm } from "~/features/login/components/login-form";

import { usePageContext } from "./context/page-context";

export function ContentLoginPage() {
  const { error } = usePageContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <LoginForm error={error} isSubmitting={false} />
    </div>
  );
}
