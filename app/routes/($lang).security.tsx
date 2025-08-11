import { data } from "react-router";

import type { Route } from "./+types/($lang).security";

import { requireAuth } from "~/auth.server";
import {
  detectSuspiciousActivity,
  getUserDevices,
  getUserSecurityLogs,
  parseDeviceInfo,
  removeDevice,
  revokeDeviceTrust,
  trustDevice,
} from "~/lib/auth/device-tracking.server";
import { getUserMFAStatus } from "~/lib/auth/mfa.server";
import {
  getUserActiveSessions,
  getUserSessionStats,
} from "~/lib/auth/session-manager.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { user } = await requireAuth(request, context.db);

  const [
    devices,
    securityLogs,
    suspiciousActivity,
    mfaStatus,
    activeSessions,
    sessionStats,
  ] = await Promise.all([
    getUserDevices(context.db, user.id),
    getUserSecurityLogs(context.db, user.id, 20),
    detectSuspiciousActivity(context.db, user.id),
    getUserMFAStatus(context.db, user.id),
    getUserActiveSessions(context.db, user.id),
    getUserSessionStats(context.db, user.id),
  ]);

  // Enhance devices with parsed info
  const processedDevices = devices.map((device: any) => ({
    ...device,
    parsed: parseDeviceInfo(device.userAgent || ""),
  }));

  return {
    user,
    devices: processedDevices,
    securityLogs,
    suspiciousActivity,
    mfaStatus,
    activeSessions,
    sessionStats,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { user } = await requireAuth(request, context.db);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const deviceId = parseInt(formData.get("deviceId") as string);

  try {
    switch (intent) {
      case "trust-device": {
        await trustDevice(context.db, user.id, deviceId, request);
        return { success: true, message: "Device trusted successfully" };
      }

      case "revoke-trust": {
        await revokeDeviceTrust(context.db, user.id, deviceId, request);
        return { success: true, message: "Device trust revoked" };
      }

      case "remove-device": {
        await removeDevice(context.db, user.id, deviceId, request);
        return { success: true, message: "Device removed" };
      }

      default:
        throw new Error("Invalid intent");
    }
  } catch (error: any) {
    throw data({ error: error.message }, { status: 400 });
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Security Dashboard - NARA" },
    {
      name: "description",
      content: "Manage your account security settings and view activity",
    },
  ];
}

export default function SecurityDashboard({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const {
    user,
    devices,
    securityLogs,
    suspiciousActivity,
    mfaStatus,
    activeSessions,
    sessionStats,
  } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Security Dashboard
                </h1>
                <p className="text-gray-600">
                  Monitor and manage your account security
                </p>
              </div>
            </div>
          </div>

          {/* Security Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${mfaStatus.isEnabled ? "bg-green-100" : "bg-red-100"}`}
                >
                  <svg
                    className={`h-6 w-6 ${mfaStatus.isEnabled ? "text-green-600" : "text-red-600"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Multi-Factor Auth</p>
                  <p
                    className={`text-lg font-semibold ${mfaStatus.isEnabled ? "text-green-600" : "text-red-600"}`}
                  >
                    {mfaStatus.isEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href="/mfa-setup"
                  className={`text-sm font-medium ${mfaStatus.isEnabled ? "text-green-600 hover:text-green-500" : "text-red-600 hover:text-red-500"}`}
                >
                  {mfaStatus.isEnabled ? "Manage MFA" : "Enable MFA"} →
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Trusted Devices</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {devices.filter((d: any) => d.isTrusted).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-indigo-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Active Sessions</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {sessionStats.activeSessions}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-purple-100 rounded-lg">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Recent Activity</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {securityLogs.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div
                  className={`flex-shrink-0 p-3 rounded-lg ${
                    suspiciousActivity.hasMultipleLocations ||
                    suspiciousActivity.hasUnusualDevices ||
                    suspiciousActivity.hasRecentFailures
                      ? "bg-yellow-100"
                      : "bg-green-100"
                  }`}
                >
                  <svg
                    className={`h-6 w-6 ${
                      suspiciousActivity.hasMultipleLocations ||
                      suspiciousActivity.hasUnusualDevices ||
                      suspiciousActivity.hasRecentFailures
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5C3.498 18.333 4.46 20 6 20z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Security Status</p>
                  <p
                    className={`text-lg font-semibold ${
                      suspiciousActivity.hasMultipleLocations ||
                      suspiciousActivity.hasUnusualDevices ||
                      suspiciousActivity.hasRecentFailures
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {suspiciousActivity.hasMultipleLocations ||
                    suspiciousActivity.hasUnusualDevices ||
                    suspiciousActivity.hasRecentFailures
                      ? "Attention"
                      : "Good"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Suspicious Activity Alert */}
          {(suspiciousActivity.hasMultipleLocations ||
            suspiciousActivity.hasUnusualDevices ||
            suspiciousActivity.hasRecentFailures) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5C3.498 18.333 4.46 20 6 20z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-800">
                    Security Recommendations
                  </h3>
                  <div className="mt-2 space-y-1">
                    {suspiciousActivity.recommendations.map(
                      (recommendation, index) => (
                        <p key={index} className="text-sm text-yellow-700">
                          • {recommendation}
                        </p>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Sessions Management */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Active Sessions
                  </h2>
                  <p className="text-sm text-gray-600">
                    You have {sessionStats.activeSessions} active session
                    {sessionStats.activeSessions !== 1 ? "s" : ""} across
                    devices
                  </p>
                </div>
                {sessionStats.activeSessions > 1 && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Are you sure you want to sign out from all active sessions?\n\n` +
                              `This will:\n` +
                              `• Sign you out from all ${sessionStats.activeSessions} active sessions\n` +
                              `• Log you out from this session immediately\n` +
                              `• Require you to sign in again on all devices\n\n` +
                              `This action cannot be undone.`,
                          )
                        ) {
                          window.location.href = "/action/logout-all";
                        }
                      }}
                      className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out From All Sessions
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6">
              {activeSessions.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No active sessions
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any tracked sessions. This may be because
                    you're using the legacy session system.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeSessions.map((session: any) => (
                    <div
                      key={session.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              Session
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          </div>
                          <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <p>
                              Created:{" "}
                              {new Date(session.createdAt).toLocaleString()}
                            </p>
                            <p>
                              Expires:{" "}
                              {new Date(session.expiresAt).toLocaleString()}
                            </p>
                            <p>Session ID: {session.id.substring(0, 16)}...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sessionStats.activeSessions > 0 && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Session Security
                      </h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>
                          If you notice any suspicious sessions or believe your
                          account has been compromised, use the "Sign Out From
                          All Sessions" button above. This will immediately
                          invalidate all active sessions and require
                          re-authentication on all devices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Device Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Device Management
                </h2>
                <p className="text-sm text-gray-600">
                  Manage devices that have accessed your account
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {devices.map((device: any) => (
                    <div
                      key={device.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">
                              {device.deviceName}
                            </h3>
                            {device.isTrusted && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Trusted
                              </span>
                            )}
                          </div>
                          <div className="mt-1 space-y-1 text-sm text-gray-600">
                            <p>
                              {device.parsed.deviceType} •{" "}
                              {device.parsed.browser} on {device.parsed.os}
                            </p>
                            <p>IP: {device.ipAddress}</p>
                            <p>
                              Last seen:{" "}
                              {new Date(device.lastSeenAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex space-x-2">
                          {!device.isTrusted ? (
                            <form method="post" className="inline">
                              <input
                                type="hidden"
                                name="intent"
                                value="trust-device"
                              />
                              <input
                                type="hidden"
                                name="deviceId"
                                value={device.id}
                              />
                              <button
                                type="submit"
                                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                              >
                                Trust
                              </button>
                            </form>
                          ) : (
                            <form method="post" className="inline">
                              <input
                                type="hidden"
                                name="intent"
                                value="revoke-trust"
                              />
                              <input
                                type="hidden"
                                name="deviceId"
                                value={device.id}
                              />
                              <button
                                type="submit"
                                className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                              >
                                Revoke
                              </button>
                            </form>
                          )}
                          <form method="post" className="inline">
                            <input
                              type="hidden"
                              name="intent"
                              value="remove-device"
                            />
                            <input
                              type="hidden"
                              name="deviceId"
                              value={device.id}
                            />
                            <button
                              type="submit"
                              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Activity Log */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Security Activity
                </h2>
                <p className="text-sm text-gray-600">
                  Latest security events for your account
                </p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {securityLogs.map((log: any) => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                          log.success ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {log.action.replace(/_/g, " ")}
                            {log.resource && ` (${log.resource})`}
                          </p>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              log.success
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.success ? "Success" : "Failed"}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          <p>{new Date(log.createdAt).toLocaleString()}</p>
                          {log.ipAddress && <p>IP: {log.ipAddress}</p>}
                          {log.details && (
                            <details className="mt-1">
                              <summary className="cursor-pointer text-blue-600 hover:text-blue-500">
                                Details
                              </summary>
                              <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(
                                  JSON.parse(log.details),
                                  null,
                                  2,
                                )}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Security Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Profile Settings</p>
                  <p className="text-sm text-gray-600">
                    Update your profile information
                  </p>
                </div>
              </a>

              <a
                href="/mfa-setup"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                  <svg
                    className="h-5 w-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">Multi-Factor Auth</p>
                  <p className="text-sm text-gray-600">
                    {mfaStatus.isEnabled
                      ? "Manage MFA settings"
                      : "Enable two-factor authentication"}
                  </p>
                </div>
              </a>

              <a
                href="/api/auth/tokens"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
                  <svg
                    className="h-5 w-5 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">API Tokens</p>
                  <p className="text-sm text-gray-600">
                    Manage your API access tokens
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* Dangerous Actions */}
          <div className="bg-red-50 border border-red-200 rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">
              Dangerous Actions
            </h2>
            <div className="space-y-4">
              <div className="bg-white border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.268 16.5C3.498 18.333 4.46 20 6 20z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-lg font-medium text-red-900">
                      Delete Account
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <div className="mt-4">
                      <form action="/action/delete-account" method="post">
                        <button
                          type="submit"
                          className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={(e) => {
                            if (
                              !confirm(
                                `Are you absolutely sure you want to delete your account?\n\n` +
                                  `This will:\n` +
                                  `• Permanently delete all your data\n` +
                                  `• Remove all your sessions and API tokens\n` +
                                  `• Cannot be undone or recovered\n\n` +
                                  `Type "DELETE" to confirm:`,
                              )
                            ) {
                              e.preventDefault();
                            } else {
                              const confirmation = prompt(
                                "Type 'DELETE' to confirm account deletion:",
                              );
                              if (confirmation !== "DELETE") {
                                e.preventDefault();
                                alert(
                                  "Account deletion cancelled. You must type 'DELETE' exactly to confirm.",
                                );
                              }
                            }
                          }}
                        >
                          <svg
                            className="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete My Account
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
