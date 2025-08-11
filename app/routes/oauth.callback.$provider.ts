import { redirect } from "react-router";

import type { OAuthProvider } from "~/lib/auth/oauth.server";
import type { Route } from "./+types/oauth.callback.$provider";

import { createUserSession } from "~/auth.server";
import {
  clearOAuthState,
  exchangeCodeForToken,
  fetchUserInfo,
  getOAuthState,
} from "~/lib/auth/oauth.server";
import { getClientIPAddress } from "~/lib/utils";
import { findOrCreateOAuthUser } from "~/user.server";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { provider } = params;

  if (!provider || !["google", "github"].includes(provider)) {
    throw new Response("Invalid OAuth provider", { status: 400 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error);
    throw redirect("/login?error=oauth_denied");
  }

  if (!code || !state) {
    throw redirect("/login?error=oauth_invalid");
  }

  // Verify state
  const storedState = getOAuthState(request);
  if (
    !storedState ||
    storedState.state !== state ||
    storedState.provider !== provider
  ) {
    throw redirect("/login?error=oauth_state_mismatch");
  }

  try {
    const { db } = context;
    const redirectUri = `${url.origin}/oauth/callback/${provider}`;

    // Exchange code for token
    const tokenResponse = await exchangeCodeForToken(
      provider as OAuthProvider,
      code,
      redirectUri,
    );

    // Get user info from OAuth provider
    const userInfo = await fetchUserInfo(
      provider as OAuthProvider,
      tokenResponse.access_token,
    );

    if (!userInfo.email) {
      throw redirect("/login?error=oauth_no_email");
    }

    // Get client metadata
    const clientIP = getClientIPAddress(request) || "unknown";
    const userAgent = request.headers.get("User-Agent") || "unknown";

    // Find or create user
    const user = await findOrCreateOAuthUser(db, userInfo, {
      ipAddress: clientIP,
      userAgent,
    });

    // Clear OAuth state and create session
    const clearStateResponse = clearOAuthState();
    const sessionResponse = await createUserSession(
      user.id,
      storedState.redirectTo || "/dashboard",
      db,
      {
        ipAddress: clientIP,
        userAgent,
      },
    );

    // Combine headers
    return new Response(null, {
      status: sessionResponse.status,
      headers: {
        ...Object.fromEntries(clearStateResponse.headers.entries()),
        ...Object.fromEntries(sessionResponse.headers.entries()),
      },
    });
  } catch (error) {
    console.error("OAuth callback error:", error);

    // Clear state on error
    const clearStateResponse = clearOAuthState();

    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(clearStateResponse.headers.entries()),
        Location: "/login?error=oauth_failed",
      },
    });
  }
}
