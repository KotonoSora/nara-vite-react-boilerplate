import { data, redirect } from "react-router";

import type { Route } from "./+types/($lang).profile";

import { requireUserId, getUserId } from "~/auth.server";
import { getUserById } from "~/user.server";

export async function loader({ request, context }: Route.LoaderArgs) {
  const userId = await requireUserId(request);
  const { db } = context;
  
  const user = await getUserById(db, userId);
  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile - NARA" },
    { name: "description", content: "Manage your profile settings" },
  ];
}

export default function Profile({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
            <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center space-x-2">
                  <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  {user.emailVerified ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Not Verified
                    </span>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900 capitalize">{user.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              {user.lastLoginAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Login</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(user.lastLoginAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Password</p>
                  <p className="text-sm text-gray-500">Last updated {new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
                <a
                  href="/forgot-password"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Change Password
                </a>
              </div>
              
              {!user.emailVerified && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Your email address is not verified. 
                        <a href="/verify-email" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                          Resend verification email
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <a
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Dashboard
            </a>
            
            <form method="post" action="/action/logout">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}