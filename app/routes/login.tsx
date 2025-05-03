import type { Route } from "./+types/login";

import { LoginForm } from "~/components/login-form";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Demo" },
    { name: "description", content: "Login  Demo Screen!" },
  ];
}

export default function LoginDemo({}: Route.ComponentProps) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
