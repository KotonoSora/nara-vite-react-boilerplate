import { redirect } from "react-router";

import type { Route } from "./+types/action.delete-account";

import { getUserSession } from "~/auth.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";
import { invalidateAllUserSessions } from "~/lib/auth/session-manager.server";
import { deleteUser } from "~/user.server";

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  // Get current user session
  const session = await getUserSession(request);
  if (!session) {
    throw redirect("/login");
  }

  const userId = session.get("userId") as number | undefined;
  if (!userId) {
    throw redirect("/login");
  }

  try {
    // Log the account deletion attempt
    await logSecurityAccess(
      db,
      userId,
      request,
      "/action/delete-account",
      "high",
      {
        action: "account_deletion",
        userId,
      },
    );

    // Invalidate all user sessions before deletion
    await invalidateAllUserSessions(db, userId);

    // Delete the user account
    const result = await deleteUser(db, userId);

    if (!result.success) {
      throw new Response(result.error || "Failed to delete account", {
        status: 500,
      });
    }

    // Redirect to home page with success message
    const url = new URL(request.url);
    const origin = url.origin;

    return redirect(`${origin}/?message=account-deleted`);
  } catch (error) {
    console.error("Account deletion error:", error);

    if (error instanceof Response) {
      throw error;
    }

    throw new Response("Failed to delete account", { status: 500 });
  }
}
