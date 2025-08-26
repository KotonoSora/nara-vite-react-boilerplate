import { data } from "react-router";
import { createThemeAction } from "remix-themes";

import type { Route } from "./+types/action.set-theme";

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

export async function action(args: Route.ActionArgs) {
  const { themeSessionResolver } = await import("~/lib/theme/sessions.server");

  return createThemeAction(themeSessionResolver)(args);
}
