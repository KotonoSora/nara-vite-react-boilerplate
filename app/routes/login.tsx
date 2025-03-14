import type { Route } from "./+types/login";

import { Login } from "~/login/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login Demo" },
    { name: "description", content: "Login  Demo Screen!" },
  ];
}

export default function LoginDemo({}: Route.ComponentProps) {
  return <Login />;
}
