import { data } from "react-router";
import type { Route } from "./+types/($lang).auth-demo";

import { getUserId } from "~/auth.server";
import { getUserById, getUserOAuthAccounts } from "~/user.server";
import { getUserPermissions } from "~/lib/auth/permissions.server";
import { getUserAPITokens } from "~/lib/auth/api-tokens.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await getUserId(request);
  const { db } = context;
  
  let user = null;
  let oauthAccounts: any[] = [];
  let permissions: any[] = [];
  let apiTokens: any[] = [];

  if (userId) {
    [user, oauthAccounts, permissions, apiTokens] = await Promise.all([
      getUserById(db, userId),
      getUserOAuthAccounts(db, userId),
      getUserPermissions(db, userId),
      getUserAPITokens(db, userId),
    ]);
  }

  return {
    isAuthenticated: !!user,
    user,
    oauthAccounts,
    permissions,
    apiTokens,
  };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Authentication Demo - NARA" },
    { name: "description", content: "Demonstration of enhanced authentication and authorization features" },
  ];
}

export default function AuthDemo({ loaderData }: Route.ComponentProps) {
  const { isAuthenticated, user, oauthAccounts, permissions, apiTokens } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Authentication & Authorization Demo</h1>
            <p className="mt-4 text-lg text-gray-600">
              Experience the comprehensive authentication features of NARA Boilerplate
            </p>
          </div>

          {!isAuthenticated ? (
            /* Unauthenticated View */
            <div className="grid md:grid-cols-2 gap-8">
              {/* Features Overview */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔐 Authentication Features</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Email/Password Authentication with bcrypt
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    OAuth Social Login (Google, GitHub)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Email Verification System
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Password Reset with Secure Tokens
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Rate Limiting & Brute Force Protection
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Login Attempt Logging & Auditing
                  </li>
                </ul>
              </div>

              {/* Authorization Features */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">🛡️ Authorization Features</h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Role-Based Access Control (RBAC)
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Fine-Grained Permissions System
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    JWT API Token Authentication
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Scoped API Access Control
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    User-Specific Permission Overrides
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✅</span>
                    Admin Dashboard & User Management
                  </li>
                </ul>
              </div>

              {/* Login Options */}
              <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Try It Out</h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/login"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Login with Email
                  </a>
                  <a
                    href="/oauth/login/google"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Login with Google
                  </a>
                  <a
                    href="/oauth/login/github"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Login with GitHub
                  </a>
                  <a
                    href="/register"
                    className="inline-flex items-center justify-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Authenticated View */
            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Profile */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  {user?.avatar && (
                    <img src={user.avatar} alt={user.name} className="h-16 w-16 rounded-full" />
                  )}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {user?.role}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Email Verified:</strong> {user?.emailVerified ? "✅ Yes" : "❌ No"}</p>
                  <p><strong>Member Since:</strong> {new Date(user?.createdAt || "").toLocaleDateString()}</p>
                  {user?.lastLoginAt && (
                    <p><strong>Last Login:</strong> {new Date(user.lastLoginAt).toLocaleString()}</p>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Permissions</h3>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium text-gray-900">{permission.name}</span>
                        <p className="text-xs text-gray-600">{permission.description}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {permission.resource}.{permission.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Accounts */}
              {oauthAccounts.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Accounts</h3>
                  <div className="space-y-3">
                    {oauthAccounts.map((account) => (
                      <div key={account.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {account.provider === "google" && (
                            <svg className="h-6 w-6" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            </svg>
                          )}
                          {account.provider === "github" && (
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{account.provider}</p>
                          <p className="text-xs text-gray-600">
                            Connected {new Date(account.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* API Tokens */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Tokens</h3>
                {apiTokens.length > 0 ? (
                  <div className="space-y-3">
                    {apiTokens.map((token) => (
                      <div key={token.id} className="p-3 border rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{token.name}</p>
                        <p className="text-xs text-gray-600">
                          Created {new Date(token.createdAt).toLocaleDateString()}
                        </p>
                        {token.scopes.length > 0 && (
                          <div className="mt-2 space-x-1">
                            {token.scopes.map((scope: string) => (
                              <span key={scope} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {scope}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No API tokens created yet.</p>
                )}
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Manage Profile
                  </a>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Dashboard
                  </a>
                  {user?.role === "admin" && (
                    <a
                      href="/admin"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Admin Panel
                    </a>
                  )}
                  <form method="post" action="/action/logout" className="inline">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Technical Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔧 Technical Implementation</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Security Stack</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>Password Hashing:</strong> bcrypt with 12 salt rounds</li>
                  <li>• <strong>Session Management:</strong> Secure HTTP-only cookies</li>
                  <li>• <strong>API Authentication:</strong> JWT tokens with HMAC-SHA256</li>
                  <li>• <strong>OAuth 2.0:</strong> Google & GitHub integration</li>
                  <li>• <strong>Rate Limiting:</strong> Sliding window with SQLite backend</li>
                  <li>• <strong>CSRF Protection:</strong> State parameter validation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Authorization Model</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• <strong>RBAC:</strong> Role-based access control system</li>
                  <li>• <strong>Permissions:</strong> Fine-grained resource.action pairs</li>
                  <li>• <strong>Inheritance:</strong> Role permissions + user overrides</li>
                  <li>• <strong>API Scopes:</strong> Token-based access control</li>
                  <li>• <strong>Audit Trail:</strong> Login attempts and access logs</li>
                  <li>• <strong>Type Safety:</strong> Full TypeScript coverage</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-8">
            <p className="text-gray-600">
              Built with React Router v7, Hono, Drizzle ORM, and Cloudflare D1
            </p>
            <a
              href="/"
              className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}