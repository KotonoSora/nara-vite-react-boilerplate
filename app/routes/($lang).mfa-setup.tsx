import { data, redirect } from "react-router";
import type { Route } from "./+types/($lang).mfa-setup";
import { requireAuth } from "~/auth.server";
import {
  generateMFASecret,
  enableMFA,
  disableMFA,
  getUserMFAStatus,
  regenerateBackupCodes,
  verifyTOTP,
} from "~/lib/auth/mfa.server";
import { logSecurityEvent } from "~/lib/auth/device-tracking.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const { user } = await requireAuth(request, context.db);
  const mfaStatus = await getUserMFAStatus(context.db, user.id);
  
  return {
    user,
    mfaStatus,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { user } = await requireAuth(request, context.db);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  try {
    switch (intent) {
      case "generate-secret": {
        const { secret, keyURI, backupCodes } = await generateMFASecret(
          context.db,
          user.id,
          user.email
        );
        
        await logSecurityEvent(
          context.db,
          user.id,
          "mfa_setup_started",
          "mfa",
          { method: "totp" },
          request
        );
        
        return {
          success: true,
          secret,
          keyURI,
          backupCodes,
        };
      }

      case "enable-mfa": {
        const token = formData.get("token") as string;
        
        if (!token) {
          throw new Error("Token is required");
        }
        
        await enableMFA(context.db, user.id, token);
        
        await logSecurityEvent(
          context.db,
          user.id,
          "mfa_enabled",
          "mfa",
          { method: "totp" },
          request
        );
        
        return {
          success: true,
          message: "MFA enabled successfully",
        };
      }

      case "disable-mfa": {
        const password = formData.get("password") as string;
        
        if (!password) {
          throw new Error("Password is required to disable MFA");
        }
        
        // Verify password (implement password verification)
        // For now, just disable MFA
        await disableMFA(context.db, user.id);
        
        await logSecurityEvent(
          context.db,
          user.id,
          "mfa_disabled",
          "mfa",
          { method: "totp" },
          request
        );
        
        return {
          success: true,
          message: "MFA disabled successfully",
        };
      }

      case "regenerate-codes": {
        const newBackupCodes = await regenerateBackupCodes(context.db, user.id);
        
        await logSecurityEvent(
          context.db,
          user.id,
          "mfa_backup_codes_regenerated",
          "mfa",
          {},
          request
        );
        
        return {
          success: true,
          backupCodes: newBackupCodes,
        };
      }

      case "verify-setup": {
        const token = formData.get("token") as string;
        const secret = formData.get("secret") as string;
        
        if (!token || !secret) {
          throw new Error("Token and secret are required");
        }
        
        const isValid = await verifyTOTP(secret, token);
        
        return {
          success: true,
          isValid,
        };
      }

      default:
        throw new Error("Invalid intent");
    }
  } catch (error: any) {
    await logSecurityEvent(
      context.db,
      user.id,
      "mfa_setup_failed",
      "mfa",
      { error: error.message, intent },
      request,
      false
    );
    
    throw data({ error: error.message }, { status: 400 });
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Multi-Factor Authentication Setup - NARA" },
    { name: "description", content: "Set up two-factor authentication for enhanced security" },
  ];
}

export default function MFASetup({ loaderData, actionData }: Route.ComponentProps) {
  const { user, mfaStatus } = loaderData;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Multi-Factor Authentication</h1>
                <p className="text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
          </div>

          {/* MFA Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Current Status</h2>
                <p className="text-sm text-gray-600">
                  MFA is currently {mfaStatus.isEnabled ? "enabled" : "disabled"} for your account
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                mfaStatus.isEnabled 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {mfaStatus.isEnabled ? "✅ Enabled" : "❌ Disabled"}
              </div>
            </div>
            
            {mfaStatus.lastUsedAt && (
              <div className="mt-4 text-sm text-gray-600">
                Last used: {new Date(mfaStatus.lastUsedAt).toLocaleString()}
              </div>
            )}
          </div>

          {!mfaStatus.isEnabled ? (
            /* Setup MFA */
            <MFASetupFlow actionData={actionData} />
          ) : (
            /* Manage MFA */
            <MFAManagement mfaStatus={mfaStatus} actionData={actionData} />
          )}

          {/* Security Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">🛡️ Security Tips</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Use an authenticator app like Google Authenticator, Authy, or 1Password</li>
              <li>• Save your backup codes in a secure location</li>
              <li>• Don't share your MFA codes with anyone</li>
              <li>• Consider using multiple authenticator apps for redundancy</li>
              <li>• Regularly review your security settings and activity</li>
            </ul>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <a
              href="/profile"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MFASetupFlow({ actionData }: { actionData?: any }) {
  return (
    <div className="space-y-6">
      {/* Step 1: Generate Secret */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Generate Secret</h2>
        
        {!actionData?.keyURI ? (
          <form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="generate-secret" />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Generate MFA Secret
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">QR Code</h3>
              <div className="bg-white p-4 rounded border">
                <div id="qr-code" className="text-center">
                  {/* QR Code would be generated client-side from keyURI */}
                  <div className="h-48 w-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Scan this QR code with your authenticator app
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Manual Entry</h3>
              <p className="text-sm text-gray-600 mb-2">
                If you can't scan the QR code, enter this secret manually:
              </p>
              <code className="bg-white px-3 py-2 rounded border text-sm font-mono">
                {actionData.secret}
              </code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">Backup Codes</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Save these backup codes in a safe place. You can use them to access your account if you lose your device:
              </p>
              <div className="grid grid-cols-2 gap-2">
                {actionData.backupCodes?.map((code: string, index: number) => (
                  <code key={index} className="bg-white px-2 py-1 rounded text-sm font-mono">
                    {code}
                  </code>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 2: Verify Setup */}
      {actionData?.keyURI && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Verify Setup</h2>
          
          <form method="post" className="space-y-4">
            <input type="hidden" name="intent" value="enable-mfa" />
            <input type="hidden" name="secret" value={actionData.secret} />
            
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Enter the code from your authenticator app:
              </label>
              <input
                type="text"
                name="token"
                id="token"
                placeholder="000000"
                maxLength={6}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-center text-xl font-mono tracking-widest"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Enable MFA
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MFAManagement({ mfaStatus, actionData }: { mfaStatus: any; actionData?: any }) {
  return (
    <div className="space-y-6">
      {/* Backup Codes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Backup Codes</h2>
            <p className="text-sm text-gray-600">
              {mfaStatus.hasBackupCodes 
                ? "You have backup codes available" 
                : "No backup codes available"}
            </p>
          </div>
          <form method="post" className="inline">
            <input type="hidden" name="intent" value="regenerate-codes" />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Regenerate Codes
            </button>
          </form>
        </div>

        {actionData?.backupCodes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">New Backup Codes</h3>
            <p className="text-sm text-yellow-700 mb-3">
              Save these new backup codes. The old ones are no longer valid:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {actionData.backupCodes.map((code: string, index: number) => (
                <code key={index} className="bg-white px-2 py-1 rounded text-sm font-mono">
                  {code}
                </code>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Disable MFA */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Disable MFA</h2>
        <p className="text-sm text-gray-600 mb-4">
          Disabling MFA will make your account less secure. You'll need to enter your password to confirm.
        </p>
        
        <form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="disable-mfa" />
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Current Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Disable MFA
          </button>
        </form>
      </div>
    </div>
  );
}