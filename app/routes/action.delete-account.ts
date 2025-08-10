import type { Route } from "./+types/action.delete-account";
import { redirect } from "react-router";

import { getUserSession } from "~/auth.server";
import { deleteUser } from "~/user.server";
import { invalidateAllUserSessions } from "~/lib/auth/session-manager.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  if (request.method !== "POST") {
    throw new Response("Method not allowed", { status: 405 });
  }

  // Get current user session
  const userSession = await getUserSession(request);
  if (!userSession) {
    throw redirect("/login");
  }

  const userId = userSession.userId;

  try {
    // Log the account deletion attempt
    await logSecurityAccess(db, userId, request, "/action/delete-account", "high", {
      action: "account_deletion",
      userId,
    });

    // Invalidate all user sessions before deletion
    await invalidateAllUserSessions(db, userId);

    // Delete the user account
    const result = await deleteUser(db, userId);

    if (!result.success) {
      throw new Response(result.error || "Failed to delete account", { status: 500 });
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