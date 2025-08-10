import { describe, it, expect, beforeEach, vi } from "vitest";
import { 
  createJWT, 
  verifyJWT, 
  hasScope,
  API_SCOPES 
} from "~/lib/auth/api-tokens.server";
import {
  createOAuthAuthorizationUrl,
  generateOAuthState,
  exchangeCodeForToken,
  fetchUserInfo,
  type OAuthProvider,
  OAUTH_PROVIDERS,
} from "~/lib/auth/oauth.server";
import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMITS,
} from "~/lib/auth/rate-limit.server";
import {
  hasPermission,
  canUserPerform,
  initializePermissions,
  DEFAULT_PERMISSIONS,
} from "~/lib/auth/permissions.server";

// Mock environment variables
vi.mock("process", () => ({
  env: {
    JWT_SECRET: "test-secret-key",
    GOOGLE_CLIENT_ID: "test-google-client-id",
    GOOGLE_CLIENT_SECRET: "test-google-client-secret",
    GITHUB_CLIENT_ID: "test-github-client-id",
    GITHUB_CLIENT_SECRET: "test-github-client-secret",
  },
}));

// Mock fetch for OAuth tests
global.fetch = vi.fn();

// Mock database
const mockDb = {
  insert: vi.fn().mockReturnValue({ values: vi.fn().mockReturnValue({ returning: vi.fn() }) }),
  select: vi.fn().mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockReturnValue({ limit: vi.fn() }) }) }),
  update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: vi.fn() }) }),
  delete: vi.fn().mockReturnValue({ where: vi.fn() }),
} as any;

describe("Enhanced Authentication System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("JWT API Tokens", () => {
    it("should create and verify JWT tokens", async () => {
      const payload = {
        sub: "123",
        iat: Math.floor(Date.now() / 1000),
        scopes: [API_SCOPES.READ_PROFILE],
        tokenId: "token-123",
      };

      const jwt = await createJWT(payload);
      expect(jwt).toBeTruthy();
      expect(jwt.split(".")).toHaveLength(3);

      const verified = await verifyJWT(jwt);
      expect(verified).toEqual(payload);
    });

    it("should reject expired tokens", async () => {
      const expiredPayload = {
        sub: "123",
        iat: Math.floor(Date.now() / 1000) - 3600,
        exp: Math.floor(Date.now() / 1000) - 1800, // Expired 30 minutes ago
        scopes: [API_SCOPES.READ_PROFILE],
        tokenId: "token-123",
      };

      const jwt = await createJWT(expiredPayload);
      const verified = await verifyJWT(jwt);
      expect(verified).toBeNull();
    });

    it("should validate scopes correctly", () => {
      expect(hasScope([API_SCOPES.READ_PROFILE], API_SCOPES.READ_PROFILE)).toBe(true);
      expect(hasScope([API_SCOPES.ALL], API_SCOPES.READ_PROFILE)).toBe(true);
      expect(hasScope([API_SCOPES.READ_PROFILE], API_SCOPES.WRITE_PROFILE)).toBe(false);
      expect(hasScope([], API_SCOPES.READ_PROFILE)).toBe(false);
    });
  });

  describe("OAuth Integration", () => {
    it("should generate OAuth authorization URLs", () => {
      const state = generateOAuthState();
      expect(state).toBeTruthy();
      expect(state).toMatch(/^[a-f0-9-]+$/);

      const googleUrl = createOAuthAuthorizationUrl("google", state, "http://localhost/callback");
      expect(googleUrl).toContain(OAUTH_PROVIDERS.google.authUrl);
      expect(googleUrl).toContain("client_id=test-google-client-id");
      expect(googleUrl).toContain(`state=${state}`);

      const githubUrl = createOAuthAuthorizationUrl("github", state, "http://localhost/callback");
      expect(githubUrl).toContain(OAUTH_PROVIDERS.github.authUrl);
      expect(githubUrl).toContain("client_id=test-github-client-id");
    });

    it("should handle OAuth token exchange", async () => {
      const mockTokenResponse = {
        access_token: "mock-access-token",
        token_type: "Bearer",
        scope: "openid email profile",
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTokenResponse),
      });

      const result = await exchangeCodeForToken("google", "auth-code", "http://localhost/callback");
      expect(result).toEqual(mockTokenResponse);
    });

    it("should fetch and normalize user info", async () => {
      // Google user info
      const googleUserData = {
        id: "google-123",
        email: "user@example.com",
        name: "John Doe",
        picture: "https://example.com/avatar.jpg",
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(googleUserData),
      });

      const googleUserInfo = await fetchUserInfo("google", "access-token");
      expect(googleUserInfo).toEqual({
        id: "google-123",
        email: "user@example.com",
        name: "John Doe",
        avatar_url: "https://example.com/avatar.jpg",
        provider: "google",
      });

      // GitHub user info
      const githubUserData = {
        id: 456,
        login: "johndoe",
        name: "John Doe",
        email: "user@example.com",
        avatar_url: "https://github.com/avatar.jpg",
      };

      (fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(githubUserData),
      });

      const githubUserInfo = await fetchUserInfo("github", "access-token");
      expect(githubUserInfo).toEqual({
        id: "456",
        email: "user@example.com",
        name: "John Doe",
        avatar_url: "https://github.com/avatar.jpg",
        provider: "github",
      });
    });
  });

  describe("Rate Limiting", () => {
    it("should extract client identifiers", () => {
      const mockRequest = {
        headers: {
          get: vi.fn((header) => {
            if (header === "CF-Connecting-IP") return "192.168.1.1";
            if (header === "X-Forwarded-For") return "10.0.0.1,192.168.1.1";
            return null;
          }),
        },
      } as any;

      const ipIdentifier = getClientIdentifier(mockRequest);
      expect(ipIdentifier).toBe("ip:192.168.1.1");

      const userIdentifier = getClientIdentifier(mockRequest, 123);
      expect(userIdentifier).toBe("user:123");
    });

    it("should enforce rate limits", async () => {
      // Mock database responses for rate limiting
      const mockRateLimitRecord = {
        id: 1,
        identifier: "ip:192.168.1.1",
        endpoint: "/login",
        attempts: 3,
        windowStart: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        createdAt: new Date(),
      };

      mockDb.select.mockReturnValueOnce({
        from: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockReturnValueOnce({
            limit: vi.fn().mockResolvedValueOnce([mockRateLimitRecord]),
          }),
        }),
      });

      mockDb.update.mockReturnValueOnce({
        set: vi.fn().mockReturnValueOnce({
          where: vi.fn().mockResolvedValueOnce({}),
        }),
      });

      const result = await checkRateLimit(
        mockDb,
        "ip:192.168.1.1",
        "/login",
        RATE_LIMITS.LOGIN
      );

      expect(result.allowed).toBe(true);
      expect(result.totalAttempts).toBe(4); // Incremented from 3
      expect(result.remaining).toBe(1); // 5 max - 4 attempts
    });
  });

  describe("RBAC Permissions", () => {
    it("should define default permissions correctly", () => {
      expect(DEFAULT_PERMISSIONS.admin).toContain(
        expect.objectContaining({ name: "admin.manage" })
      );
      expect(DEFAULT_PERMISSIONS.user).toContain(
        expect.objectContaining({ name: "profile.read" })
      );
      expect(DEFAULT_PERMISSIONS.user).not.toContain(
        expect.objectContaining({ name: "admin.manage" })
      );
    });

    it("should initialize permissions in database", async () => {
      // Mock successful insertions
      mockDb.insert.mockImplementation(() => ({
        values: vi.fn().mockReturnValue({
          onConflictDoNothing: vi.fn().mockResolvedValue({}),
        }),
      }));

      mockDb.select.mockImplementation(() => ({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ id: 1 }]),
          }),
        }),
      }));

      await initializePermissions(mockDb);

      // Should insert permissions and role-permission relationships
      expect(mockDb.insert).toHaveBeenCalled();
    });

    it("should check user permissions", async () => {
      // Mock user role and permissions
      mockDb.select.mockImplementation(() => ({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([{ role: "admin" }]),
          }),
        }),
      }));

      // Mock role permissions
      mockDb.select.mockImplementationOnce(() => ({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([
              {
                id: 1,
                name: "admin.manage",
                description: "Full admin access",
                resource: "admin",
                action: "manage",
              },
            ]),
          }),
        }),
      }));

      // Mock user-specific permissions (empty)
      mockDb.select.mockImplementationOnce(() => ({
        from: vi.fn().mockReturnValue({
          innerJoin: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([]),
          }),
        }),
      }));

      const hasAdminPermission = await hasPermission(mockDb, 1, "admin.manage");
      expect(hasAdminPermission).toBe(true);

      const canManageUsers = await canUserPerform(mockDb, 1, "user", "create");
      expect(canManageUsers).toBe(true); // Admin can do everything
    });
  });

  describe("Integration Tests", () => {
    it("should integrate OAuth with rate limiting", async () => {
      // Mock rate limit check - allow request
      mockDb.select.mockResolvedValueOnce([]);
      mockDb.insert.mockResolvedValueOnce({});

      const rateLimitResult = await checkRateLimit(
        mockDb,
        "ip:192.168.1.1",
        "/oauth/login/google",
        RATE_LIMITS.LOGIN
      );

      expect(rateLimitResult.allowed).toBe(true);

      // Generate OAuth URL
      const state = generateOAuthState();
      const oauthUrl = createOAuthAuthorizationUrl("google", state, "http://localhost/callback");
      
      expect(oauthUrl).toContain("google");
      expect(oauthUrl).toContain(state);
    });

    it("should integrate permissions with API tokens", () => {
      const adminScopes = [API_SCOPES.ADMIN];
      const userScopes = [API_SCOPES.READ_PROFILE];

      expect(hasScope(adminScopes, API_SCOPES.READ_USERS)).toBe(true); // Admin scope covers all
      expect(hasScope(userScopes, API_SCOPES.READ_USERS)).toBe(false); // User scope is limited
    });
  });
});