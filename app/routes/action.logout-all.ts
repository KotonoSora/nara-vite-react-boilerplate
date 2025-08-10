import type { Route } from "./+types/action.logout-all";
import { logoutFromAllSessions } from "~/auth.server";
import { getClientIPAddress } from "~/lib/utils";

export async function action({ request, context }: Route.ActionArgs) {
  const ipAddress = getClientIPAddress(request);
  const userAgent = request.headers.get("User-Agent") || undefined;
  
  return logoutFromAllSessions(request, context.db, {
    ipAddress,
    userAgent,
  });
}

export async function loader({ request, context }: Route.LoaderArgs) {
  // Also support GET requests for logout-all
  const ipAddress = getClientIPAddress(request);
  const userAgent = request.headers.get("User-Agent") || undefined;
  
  return logoutFromAllSessions(request, context.db, {
    ipAddress,
    userAgent,
  });
}