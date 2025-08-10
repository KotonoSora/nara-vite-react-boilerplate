import { data } from "react-router";
import type { Route } from "./+types/api.auth.tokens";

import { requireUserId } from "~/auth.server";
import { 
  createAPIToken, 
  getUserAPITokens, 
  revokeAPIToken,
  API_SCOPES,
} from "~/lib/auth/api-tokens.server";
import { createRateLimiters } from "~/lib/auth/rate-limit.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  // Rate limiting
  const rateLimiters = createRateLimiters(db);
  await rateLimiters.apiGeneral(request, "/api/auth/tokens", userId);

  const tokens = await getUserAPITokens(db, userId);
  
  return data({
    tokens,
    availableScopes: Object.values(API_SCOPES),
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const userId = await requireUserId(request);
  const { db } = context;

  // Rate limiting for token creation/deletion
  const rateLimiters = createRateLimiters(db);
  await rateLimiters.apiStrict(request, "/api/auth/tokens", userId);

  const method = request.method;

  if (method === "POST") {
    // Create new API token
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const scopesString = formData.get("scopes") as string;
    const expiresInDays = parseInt(formData.get("expiresInDays") as string) || undefined;

    if (!name || name.length < 3) {
      return data({ error: "Token name must be at least 3 characters" }, { status: 400 });
    }

    let scopes: string[] = [];
    if (scopesString) {
      try {
        scopes = JSON.parse(scopesString);
      } catch {
        scopes = scopesString.split(",").map(s => s.trim()).filter(Boolean);
      }
    }

    // Validate scopes
    const validScopes = Object.values(API_SCOPES);
    const invalidScopes = scopes.filter(scope => !validScopes.includes(scope as any));
    if (invalidScopes.length > 0) {
      return data(
        { error: `Invalid scopes: ${invalidScopes.join(", ")}` },
        { status: 400 }
      );
    }

    try {
      const tokenInfo = await createAPIToken(db, userId, {
        name,
        scopes,
        expiresInDays,
      });

      return data({
        message: "API token created successfully",
        token: tokenInfo,
      });
    } catch (error) {
      console.error("Failed to create API token:", error);
      return data({ error: "Failed to create API token" }, { status: 500 });
    }
  }

  if (method === "DELETE") {
    // Revoke API token
    const formData = await request.formData();
    const tokenId = parseInt(formData.get("tokenId") as string);

    if (!tokenId || isNaN(tokenId)) {
      return data({ error: "Invalid token ID" }, { status: 400 });
    }

    try {
      const success = await revokeAPIToken(db, userId, tokenId);
      
      if (!success) {
        return data({ error: "Token not found or already revoked" }, { status: 404 });
      }

      return data({ message: "API token revoked successfully" });
    } catch (error) {
      console.error("Failed to revoke API token:", error);
      return data({ error: "Failed to revoke API token" }, { status: 500 });
    }
  }

  return data({ error: "Method not allowed" }, { status: 405 });
}