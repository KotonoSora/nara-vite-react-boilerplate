import type { Route } from "./+types/action.logout";

export async function action({ request }: Route.ActionArgs) {
  const { logout } = await import(
    "~/lib/authentication/server/authenticate.server"
  );

  return logout(request);
}

export async function loader({ request }: Route.LoaderArgs) {
  const { logout } = await import(
    "~/lib/authentication/server/authenticate.server"
  );

  return logout(request);
}
