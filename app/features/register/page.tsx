import { RegisterForm } from "~/features/register/components/register-form";

import { usePageContext } from "./context/page-context";

export function ContentRegisterPage() {
  const { error } = usePageContext();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <RegisterForm error={error} isSubmitting={false} />
    </div>
  );
}
