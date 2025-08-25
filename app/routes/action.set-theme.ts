import { data } from "react-router";
import { createThemeAction } from "remix-themes";

import type { Route } from "./+types/action.set-theme";

import { themeSessionResolver } from "~/lib/theme/sessions.server";

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

export const action = createThemeAction(themeSessionResolver);
