import { data } from "react-router";

import type { Route } from "./+types/action.logout";

export function loader({ request }: Route.LoaderArgs) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: request.headers.get("referer") || "/",
      },
    },
  );
}

export async function action({ request }: Route.ActionArgs) {
  const { logout } =
    await import("~/lib/authentication/server/authenticate.server");

  return logout(request);
}
