import { data } from "react-router";

import type { Route } from "./+types/($lang).admin-security";

import {
  getUserSecurityLogs,
  logSecurityEvent,
} from "~/lib/auth/device-tracking.server";
import { requireCriticalSecurity } from "~/lib/auth/middleware.server";
import { getUserById } from "~/user.server";

/**
 * High-security admin route that demonstrates multi-layer authentication:
 * 1. Session authentication (UI) or JWT token (API)
 * 2. Basic authentication for additional security
 * 3. Admin permission verification
 * 4. Audit logging
 */

export async function loader({ request, context }: Route.LoaderArgs) {
  const { db } = context;

  // Critical security authentication with admin permissions
  const authResult = await requireCriticalSecurity(request, db, [
    "admin.manage",
  ]);

  // Get additional security information
  const auditLogs = await getUserSecurityLogs(db, authResult.userId, 50);

  // Get full user information
  const user = await getUserById(db, authResult.userId);

  return data({
    user,
    authFlow: authResult.flow,
    auditLogs,
    securityLevel: "critical",
    message: "Access granted to critical security area",
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  // Same critical security requirements for actions
  const authResult = await requireCriticalSecurity(request, db, [
    "admin.manage",
  ]);

  const formData = await request.formData();
  const action = formData.get("action") as string;

  // Log the admin action
  await logSecurityEvent(
    db,
    authResult.userId,
    "admin_security_action",
    "security_panel",
    { action, timestamp: new Date().toISOString() },
    request,
    true,
  );

  return data({
    message: `Security action '${action}' executed successfully`,
    timestamp: new Date().toISOString(),
  });
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Critical Security Area - Admin" },
    { name: "description", content: "High-security administrative panel" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function AdminSecurity({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Critical Security Area
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      This area requires critical-level security authentication
                      including: session/API authentication, basic auth, and
                      admin permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                High-Security Admin Panel
              </h1>
              <p className="mt-2 text-gray-600">{loaderData.message}</p>
            </div>

            {actionData && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="text-sm text-green-700">
                  {actionData.message}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Authentication Status
                </h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-600">User:</dt>
                    <dd className="text-sm text-gray-900">
                      {loaderData.user?.name} ({loaderData.user?.email})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      Auth Flow:
                    </dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {loaderData.authFlow}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">
                      Security Level:
                    </dt>
                    <dd className="text-sm text-red-600 font-semibold uppercase">
                      {loaderData.securityLevel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Role:</dt>
                    <dd className="text-sm text-gray-900 capitalize">
                      {loaderData.user?.role}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Security Features
                </h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Session/JWT Authentication</li>
                  <li>✓ Basic Authentication Layer</li>
                  <li>✓ Admin Permission Check</li>
                  <li>✓ Rate Limiting Protection</li>
                  <li>✓ Audit Logging</li>
                  <li>✓ IP & User Agent Tracking</li>
                </ul>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Actions
              </h3>
              <form method="post" className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="submit"
                    name="action"
                    value="security_scan"
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Run Security Scan
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value="audit_review"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Review Audit Logs
                  </button>
                  <button
                    type="submit"
                    name="action"
                    value="system_check"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    System Health Check
                  </button>
                </div>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Security Audit Logs
              </h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Resource
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {loaderData.auditLogs.map(
                        (
                          log: Awaited<
                            ReturnType<typeof getUserSecurityLogs>
                          >[number],
                        ) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {log.action}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                              {log.resource || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                              {log.ipAddress || "N/A"}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  log.success
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {log.success ? "Success" : "Failed"}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
