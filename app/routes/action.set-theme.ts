import { data } from "react-router";
import { createThemeAction } from "remix-themes";

import type { Route } from "./+types/action.set-theme";

import { redirectBack } from "~/lib/http/redirect";
import { themeSessionResolver } from "~/sessions.server";

export function loader({ request }: Route.LoaderArgs) {
  return redirectBack(request);
}

export const action = createThemeAction(themeSessionResolver);
