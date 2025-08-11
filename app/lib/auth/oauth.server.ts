import { redirect } from "react-router";
import { z } from "zod";

// OAuth provider configurations
export const OAUTH_PROVIDERS = {
  google: {
    name: "Google",
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
    scope: "openid email profile",
  },
  github: {
    name: "GitHub",
    authUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    userInfoUrl: "https://api.github.com/user",
    scope: "user:email",
  },
} as const;

export type OAuthProvider = keyof typeof OAUTH_PROVIDERS;

// Environment variables validation
const oauthEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),
  OAUTH_CALLBACK_URL: z.string().url().optional(),
});

export function getOAuthConfig() {
  const env = oauthEnvSchema.safeParse(process.env);
  if (!env.success) {
    console.warn("OAuth environment variables not properly configured");
    return null;
  }
  return env.data;
}

// OAuth state management for CSRF protection
export function generateOAuthState(): string {
  return crypto.randomUUID() + "-" + Date.now().toString(36);
}

export function createOAuthAuthorizationUrl(
  provider: OAuthProvider,
  state: string,
  redirectUri: string,
): string {
  const config = getOAuthConfig();
  if (!config) {
    throw new Error("OAuth not configured");
  }

  const providerConfig = OAUTH_PROVIDERS[provider];
  const params = new URLSearchParams();

  // Common OAuth parameters
  params.set("response_type", "code");
  params.set("state", state);
  params.set("redirect_uri", redirectUri);
  params.set("scope", providerConfig.scope);

  // Provider-specific client ID
  if (provider === "google" && config.GOOGLE_CLIENT_ID) {
    params.set("client_id", config.GOOGLE_CLIENT_ID);
  } else if (provider === "github" && config.GITHUB_CLIENT_ID) {
    params.set("client_id", config.GITHUB_CLIENT_ID);
  } else {
    throw new Error(`OAuth client ID not configured for ${provider}`);
  }

  return `${providerConfig.authUrl}?${params.toString()}`;
}

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in?: number;
  refresh_token?: string;
}

export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
): Promise<OAuthTokenResponse> {
  const config = getOAuthConfig();
  if (!config) {
    throw new Error("OAuth not configured");
  }

  const providerConfig = OAUTH_PROVIDERS[provider];
  let clientId: string;
  let clientSecret: string;

  if (provider === "google") {
    if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
      throw new Error("Google OAuth credentials not configured");
    }
    clientId = config.GOOGLE_CLIENT_ID;
    clientSecret = config.GOOGLE_CLIENT_SECRET;
  } else if (provider === "github") {
    if (!config.GITHUB_CLIENT_ID || !config.GITHUB_CLIENT_SECRET) {
      throw new Error("GitHub OAuth credentials not configured");
    }
    clientId = config.GITHUB_CLIENT_ID;
    clientSecret = config.GITHUB_CLIENT_SECRET;
  } else {
    throw new Error(`Unsupported OAuth provider: ${provider}`);
  }

  const tokenParams = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(providerConfig.tokenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: tokenParams.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return await response.json();
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  provider: OAuthProvider;
}

export async function fetchUserInfo(
  provider: OAuthProvider,
  accessToken: string,
): Promise<OAuthUserInfo> {
  const providerConfig = OAUTH_PROVIDERS[provider];

  const response = await fetch(providerConfig.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user info");
  }

  const userData = (await response.json()) as any;

  // Normalize user data across providers
  if (provider === "google") {
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar_url: userData.picture,
      provider: "google",
    };
  } else if (provider === "github") {
    // GitHub might not return email in the user endpoint
    // We need to fetch it separately if it's private
    let email = userData.email;
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      if (emailResponse.ok) {
        const emails = (await emailResponse.json()) as any[];
        const primaryEmail = emails.find((e: any) => e.primary);
        email = primaryEmail?.email || emails[0]?.email;
      }
    }

    return {
      id: userData.id.toString(),
      email: email || "",
      name: userData.name || userData.login,
      avatar_url: userData.avatar_url,
      provider: "github",
    };
  }

  throw new Error(`Unsupported provider: ${provider}`);
}

// OAuth session state storage
export interface OAuthState {
  provider: OAuthProvider;
  state: string;
  redirectTo?: string;
  createdAt: number;
}

const OAUTH_STATE_STORAGE_KEY = "__oauth_state";
const OAUTH_STATE_EXPIRY = 10 * 60 * 1000; // 10 minutes

export function storeOAuthState(
  request: Request,
  oauthState: Omit<OAuthState, "createdAt">,
): Response {
  const state: OAuthState = {
    ...oauthState,
    createdAt: Date.now(),
  };

  // In a real app, you'd store this in a secure session or database
  // For this example, we'll use a cookie (not recommended for production)
  const cookie = btoa(JSON.stringify(state));

  return new Response(null, {
    headers: {
      "Set-Cookie": `${OAUTH_STATE_STORAGE_KEY}=${cookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`,
    },
  });
}

export function getOAuthState(request: Request): OAuthState | null {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, value] = c.trim().split("=");
      return [key, value];
    }),
  );

  const stateCookie = cookies[OAUTH_STATE_STORAGE_KEY];
  if (!stateCookie) return null;

  try {
    const state: OAuthState = JSON.parse(atob(stateCookie));

    // Check if state has expired
    if (Date.now() - state.createdAt > OAUTH_STATE_EXPIRY) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

export function clearOAuthState(): Response {
  return new Response(null, {
    headers: {
      "Set-Cookie": `${OAUTH_STATE_STORAGE_KEY}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
    },
  });
}
