import type { Route } from "./+types/action.logout";
import { logout } from "~/sessions.server";

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  return logout(request);
}