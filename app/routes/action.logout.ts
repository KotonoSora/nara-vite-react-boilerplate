import type { Route } from "./+types/action.logout";

import { logout } from "~/auth.server";
import { getClientIPAddress } from "~/lib/utils";

export async function action({ request, context }: Route.ActionArgs) {
  const ipAddress = getClientIPAddress(request);
  const userAgent = request.headers.get("User-Agent") || undefined;

  return logout(request, context.db, {
    ipAddress,
    userAgent,
  });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const ipAddress = getClientIPAddress(request);
  const userAgent = request.headers.get("User-Agent") || undefined;

  return logout(request, context.db, {
    ipAddress,
    userAgent,
  });
}
