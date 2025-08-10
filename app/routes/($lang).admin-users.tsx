import type { Route } from "./+types/($lang).admin-users";
import { Form, useActionData, useLoaderData } from "react-router";
import { useState } from "react";

import { getUserSession } from "~/auth.server";
import { getUsersCreatedBy, updateUserByAdmin, deleteUserByAdmin, createUser } from "~/user.server";
import { requireAdminRole } from "~/lib/auth/permissions.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";
import { getLanguageSession } from "~/language.server";
import { DEFAULT_LANGUAGE, getLanguageFromPath, getTranslation } from "~/lib/i18n";

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const { db } = context;

  // Get current user session and require admin role
  const userSession = await getUserSession(request);
  if (!userSession) {
    throw new Response("Unauthorized", { status: 401 });
  }

  await requireAdminRole(db, userSession.userId);

  // Get users created by this admin
  const managedUsers = await getUsersCreatedBy(db, userSession.userId);

  // Log security access
  await logSecurityAccess(db, userSession.userId, request, "/admin-users", "high", {
    action: "admin_user_management_access",
  });

  // Handle language detection
  const url = new URL(request.url);
  const pathLanguage = getLanguageFromPath(url.pathname);
  const languageSession = await getLanguageSession(request);
  const cookieLanguage = languageSession.getLanguage();
  const language = pathLanguage || cookieLanguage || DEFAULT_LANGUAGE;

  return {
    managedUsers,
    language,
    currentUserId: userSession.userId,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  // Get current user session and require admin role
  const userSession = await getUserSession(request);
  if (!userSession) {
    throw new Response("Unauthorized", { status: 401 });
  }

  await requireAdminRole(db, userSession.userId);

  const formData = await request.formData();
  const actionType = formData.get("actionType")?.toString();

  try {
    switch (actionType) {
      case "create": {
        const email = formData.get("email")?.toString();
        const password = formData.get("password")?.toString();
        const name = formData.get("name")?.toString();

        if (!email || !password || !name) {
          return { error: "All fields are required" };
        }

        const newUser = await createUser(db, {
          email,
          password,
          name,
          role: "user",
          createdBy: userSession.userId,
        }, {
          sendVerificationEmail: true,
          baseUrl: new URL(request.url).origin,
        });

        await logSecurityAccess(db, userSession.userId, request, "/admin-users", "high", {
          action: "user_created",
          targetUserId: newUser.id,
        });

        return { success: "User created successfully" };
      }

      case "update": {
        const userId = parseInt(formData.get("userId")?.toString() || "0");
        const name = formData.get("name")?.toString();
        const email = formData.get("email")?.toString();

        if (!userId || !name || !email) {
          return { error: "User ID, name, and email are required" };
        }

        const result = await updateUserByAdmin(db, userSession.userId, userId, {
          name,
          email,
        });

        if (!result.success) {
          return { error: result.error };
        }

        await logSecurityAccess(db, userSession.userId, request, "/admin-users", "high", {
          action: "user_updated",
          targetUserId: userId,
        });

        return { success: "User updated successfully" };
      }

      case "delete": {
        const userId = parseInt(formData.get("userId")?.toString() || "0");

        if (!userId) {
          return { error: "User ID is required" };
        }

        const result = await deleteUserByAdmin(db, userSession.userId, userId);

        if (!result.success) {
          return { error: result.error };
        }

        await logSecurityAccess(db, userSession.userId, request, "/admin-users", "high", {
          action: "user_deleted",
          targetUserId: userId,
        });

        return { success: "User deleted successfully" };
      }

      default:
        return { error: "Invalid action" };
    }
  } catch (error) {
    console.error("Admin user management error:", error);
    return { error: "Operation failed" };
  }
}

export default function AdminUsers() {
  const { managedUsers, language } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const t = getTranslation(language);

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {t.admin.userManagement || "User Management"}
        </h1>

        {actionData?.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {actionData.error}
          </div>
        )}

        {actionData?.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {actionData.success}
          </div>
        )}

        {/* Create User Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {t.admin.createUser || "Create New User"}
            </h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {showCreateForm ? "Cancel" : (t.admin.addUser || "Add User")}
            </button>
          </div>

          {showCreateForm && (
            <Form method="post" className="space-y-4">
              <input type="hidden" name="actionType" value="create" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.auth.email || "Email"}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.auth.name || "Name"}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t.auth.password || "Password"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                {t.admin.createUser || "Create User"}
              </button>
            </Form>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              {t.admin.managedUsers || "Managed Users"} ({managedUsers.length})
            </h2>
          </div>

          {managedUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {t.admin.noUsers || "No users created yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.user || "User"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.email || "Email"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.created || "Created"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.lastLogin || "Last Login"}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.admin.actions || "Actions"}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {managedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar && (
                            <img
                              className="h-8 w-8 rounded-full mr-3"
                              src={user.avatar}
                              alt={user.name}
                            />
                          )}
                          <div>
                            {editingUser === user.id ? (
                              <Form method="post" className="inline">
                                <input type="hidden" name="actionType" value="update" />
                                <input type="hidden" name="userId" value={user.id} />
                                <input
                                  type="text"
                                  name="name"
                                  defaultValue={user.name}
                                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                                  required
                                />
                              </Form>
                            ) : (
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user.id ? (
                          <input
                            type="email"
                            name="email"
                            form={`update-form-${user.id}`}
                            defaultValue={user.email}
                            className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                            required
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{user.email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        {editingUser === user.id ? (
                          <>
                            <Form method="post" className="inline" id={`update-form-${user.id}`}>
                              <input type="hidden" name="actionType" value="update" />
                              <input type="hidden" name="userId" value={user.id} />
                              <button
                                type="submit"
                                className="text-green-600 hover:text-green-900"
                              >
                                {t.common.save || "Save"}
                              </button>
                            </Form>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              {t.common.cancel || "Cancel"}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setEditingUser(user.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {t.common.edit || "Edit"}
                            </button>
                            <Form method="post" className="inline">
                              <input type="hidden" name="actionType" value="delete" />
                              <input type="hidden" name="userId" value={user.id} />
                              <button
                                type="submit"
                                className="text-red-600 hover:text-red-900"
                                onClick={(e) => {
                                  if (!confirm(t.admin.confirmDelete || "Are you sure you want to delete this user?")) {
                                    e.preventDefault();
                                  }
                                }}
                              >
                                {t.common.delete || "Delete"}
                              </button>
                            </Form>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}