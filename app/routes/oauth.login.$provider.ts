import { redirect } from "react-router";

import type { OAuthProvider } from "~/lib/auth/oauth.server";
import type { Route } from "./+types/oauth.login.$provider";

import {
  createOAuthAuthorizationUrl,
  generateOAuthState,
  storeOAuthState,
} from "~/lib/auth/oauth.server";

export async function loader({ request, params }: Route.LoaderArgs) {
  const { provider } = params;

  if (!provider || !["google", "github"].includes(provider)) {
    throw new Response("Invalid OAuth provider", { status: 400 });
  }

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") || "/dashboard";

  try {
    const state = generateOAuthState();
    const redirectUri = `${url.origin}/oauth/callback/${provider}`;

    const authUrl = createOAuthAuthorizationUrl(
      provider as OAuthProvider,
      state,
      redirectUri,
    );

    // Store OAuth state
    const stateResponse = storeOAuthState(request, {
      provider: provider as OAuthProvider,
      state,
      redirectTo,
    });

    // Redirect to OAuth provider
    return new Response(null, {
      status: 302,
      headers: {
        ...Object.fromEntries(stateResponse.headers.entries()),
        Location: authUrl,
      },
    });
  } catch (error) {
    console.error("OAuth login error:", error);
    throw redirect(`/login?error=oauth_config`);
  }
}
