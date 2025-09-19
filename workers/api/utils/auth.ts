/**
 * JWT Token utilities for API authentication
 * Uses Web Crypto API for proper HMAC-SHA256 signing
 *
 * SECURITY REQUIREMENTS:
 * - JWT_SECRET environment variable MUST be set in Cloudflare Workers
 * - AUTH_SESSION_SECRET environment variable MUST be set for session cookies
 * - Use `wrangler secret put` to set them securely
 * - Generate strong, random secrets (minimum 32 characters each)
 * - Never commit secrets to version control
 *
 * Example setup:
 * $ wrangler secret put JWT_SECRET
 * ? Enter a secret value: [paste your generated JWT secret here]
 * $ wrangler secret put AUTH_SESSION_SECRET
 * ? Enter a secret value: [paste your generated session secret here]
 */
export const tokenUtils = {
  /**
   * Gets the secret key for HMAC signing from environment variables
   * Throws an error if JWT_SECRET is not configured
   */
  async getSecretKey(env: Env): Promise<CryptoKey> {
    if (!env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET environment variable is required but not configured",
      );
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(env.JWT_SECRET);

    return await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"],
    );
  },

  /**
   * Creates a proper JWT token with HMAC-SHA256 signature
   */
  async createToken(
    env: Env,
    payload: { userId: number; role: string },
    expiresInSeconds: number = 3600,
  ): Promise<string> {
    const header = {
      typ: "JWT",
      alg: "HS256",
    };

    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const tokenPayload = {
      ...payload,
      exp,
      iat: Math.floor(Date.now() / 1000),
    };

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(tokenPayload));

    // Create proper HMAC-SHA256 signature
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const secretKey = await this.getSecretKey(env);
    const encoder = new TextEncoder();

    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      secretKey,
      encoder.encode(signingInput),
    );

    const signature = btoa(
      String.fromCharCode(...new Uint8Array(signatureBuffer)),
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  },

  /**
   * Validates and decodes a JWT token with proper signature verification
   */
  async validateToken(
    env: Env,
    token: string,
  ): Promise<{ userId: number; role: string; exp: number } | null> {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const [encodedHeader, encodedPayload, signature] = parts;

      // Verify signature
      const signingInput = `${encodedHeader}.${encodedPayload}`;
      const secretKey = await this.getSecretKey(env);
      const encoder = new TextEncoder();

      const signatureBuffer = new Uint8Array(
        atob(signature)
          .split("")
          .map((c) => c.charCodeAt(0)),
      );

      const isValid = await crypto.subtle.verify(
        "HMAC",
        secretKey,
        signatureBuffer,
        encoder.encode(signingInput),
      );

      if (!isValid) {
        return null;
      }

      const payload = JSON.parse(atob(encodedPayload));

      if (
        payload.userId == null ||
        typeof payload.userId !== "number" ||
        !payload.exp ||
        Date.now() / 1000 > payload.exp
      ) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  },
};
