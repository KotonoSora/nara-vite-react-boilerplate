import { data } from "react-router";
import type { Route } from "./+types/($lang).secure-profile";

import { requireHighSecurity } from "~/lib/auth/middleware.server";
import { getUserById } from "~/user.server";
import { getUserAPITokens } from "~/lib/auth/api-tokens.server";

/**
 * High-security profile route that requires basic authentication
 * before accessing sensitive profile information
 */

export async function loader({ request, context }: Route.LoaderArgs) {
  const { db } = context;

  // High security authentication with profile permissions
  const authResult = await requireHighSecurity(request, db, ["profile.read"]);

  // Get user details and API tokens
  const user = await getUserById(db, authResult.userId);
  const apiTokens = await getUserAPITokens(db, authResult.userId);
  
  return data({
    user,
    authFlow: authResult.flow,
    apiTokens,
    securityLevel: "high",
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  // High security authentication for profile updates
  const authResult = await requireHighSecurity(request, db, ["profile.update"]);

  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "revoke_token") {
    const tokenId = parseInt(formData.get("tokenId") as string);
    
    const { revokeAPIToken } = await import("~/lib/auth/api-tokens.server");
    const success = await revokeAPIToken(db, authResult.userId, tokenId);
    
    if (success) {
      return data({ message: "API token revoked successfully" });
    } else {
      return data({ error: "Failed to revoke token" }, { status: 400 });
    }
  }

  return data({ error: "Invalid action" }, { status: 400 });
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Secure Profile - High Security" },
    { name: "description", content: "High-security profile management" },
  ];
}

export default function SecureProfile({ loaderData, actionData }: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    High-Security Area
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>
                      This area requires additional basic authentication for enhanced security.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Secure Profile Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage sensitive profile information and API tokens with enhanced security.
              </p>
            </div>

            {actionData?.message && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="text-sm text-green-700">
                  {actionData.message}
                </div>
              </div>
            )}

            {actionData?.error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="text-sm text-red-700">
                  {actionData.error}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Security Status
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Authentication:</dt>
                    <dd className="text-sm text-gray-900 capitalize">{loaderData.authFlow}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Security Level:</dt>
                    <dd className="text-sm text-orange-600 font-semibold uppercase">{loaderData.securityLevel}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Basic Auth:</dt>
                    <dd className="text-sm text-green-600">✓ Verified</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Profile Information
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Name:</dt>
                    <dd className="text-sm text-gray-900">{loaderData.user?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email:</dt>
                    <dd className="text-sm text-gray-900">{loaderData.user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Role:</dt>
                    <dd className="text-sm text-gray-900 capitalize">{loaderData.user?.role}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Email Verified:</dt>
                    <dd className="text-sm text-gray-900">
                      {loaderData.user?.emailVerified ? "✓ Yes" : "✗ No"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API Tokens
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage your API tokens for programmatic access. These tokens provide secure access to your account via API.
              </p>
              
              {loaderData.apiTokens.length === 0 ? (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">No API tokens found.</p>
                  <a 
                    href="/profile" 
                    className="mt-2 inline-block text-blue-600 hover:text-blue-500"
                  >
                    Create your first API token
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Scopes
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Last Used
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Expires
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loaderData.apiTokens.map((token) => (
                        <tr key={token.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {token.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                            {token.scopes ? JSON.parse(token.scopes).join(", ") : "None"}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                            {token.lastUsedAt 
                              ? new Date(token.lastUsedAt).toLocaleDateString()
                              : "Never"
                            }
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                            {token.expiresAt 
                              ? new Date(token.expiresAt).toLocaleDateString()
                              : "Never"
                            }
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">
                            <form method="post" className="inline">
                              <input type="hidden" name="action" value="revoke_token" />
                              <input type="hidden" name="tokenId" value={token.id} />
                              <button
                                type="submit"
                                className="text-red-600 hover:text-red-800 font-medium"
                                onClick={(e) => {
                                  if (!confirm("Are you sure you want to revoke this token?")) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                Revoke
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Security Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This page requires high-security authentication. You have been authenticated using:
                    </p>
                    <ul className="mt-2 list-disc list-inside">
                      <li>Session or JWT token authentication</li>
                      <li>Basic authentication for additional security</li>
                      <li>Profile read/update permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}