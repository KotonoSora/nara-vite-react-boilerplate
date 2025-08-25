import type { Route } from "./+types/action.logout";

import { logout } from "~/lib/auth/auth.server";

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}
