import type { Route } from "./+types/api.admin.users";
import { z } from "zod";

import { getUserSession } from "~/auth.server";
import { getUsersCreatedBy, updateUserByAdmin, deleteUserByAdmin, createUser } from "~/user.server";
import { requireAdminRole } from "~/lib/auth/permissions.server";
import { logSecurityAccess } from "~/lib/auth/route-security.server";

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const updateUserSchema = z.object({
  userId: z.number(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "user"]).optional(),
});

const deleteUserSchema = z.object({
  userId: z.number(),
});

export async function loader({ request, context }: Route.LoaderArgs) {
  const { db } = context;

  // Get current user session and require admin role
  const userSession = await getUserSession(request);
  if (!userSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await requireAdminRole(db, userSession.userId);
  } catch {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  // Get users created by this admin
  const managedUsers = await getUsersCreatedBy(db, userSession.userId);

  await logSecurityAccess(db, userSession.userId, request, "/api/admin/users", "high", {
    action: "admin_users_list",
  });

  return Response.json({
    users: managedUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  });
}

export async function action({ request, context }: Route.ActionArgs) {
  const { db } = context;

  // Get current user session and require admin role
  const userSession = await getUserSession(request);
  if (!userSession) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await requireAdminRole(db, userSession.userId);
  } catch {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const method = request.method;

  try {
    switch (method) {
      case "POST": {
        // Create new user
        const body = await request.json();
        const validatedData = createUserSchema.parse(body);

        const newUser = await createUser(db, {
          email: validatedData.email,
          password: validatedData.password,
          name: validatedData.name,
          role: "user",
          createdBy: userSession.userId,
        }, {
          sendVerificationEmail: true,
          baseUrl: new URL(request.url).origin,
        });

        await logSecurityAccess(db, userSession.userId, request, "/api/admin/users", "high", {
          action: "user_created",
          targetUserId: newUser.id,
        });

        return Response.json({
          success: true,
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            emailVerified: newUser.emailVerified,
            createdAt: newUser.createdAt,
          },
        });
      }

      case "PUT": {
        // Update user
        const body = await request.json();
        const validatedData = updateUserSchema.parse(body);

        const result = await updateUserByAdmin(
          db,
          userSession.userId,
          validatedData.userId,
          {
            name: validatedData.name,
            email: validatedData.email,
            role: validatedData.role,
          }
        );

        if (!result.success) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        await logSecurityAccess(db, userSession.userId, request, "/api/admin/users", "high", {
          action: "user_updated",
          targetUserId: validatedData.userId,
        });

        return Response.json({
          success: true,
          user: {
            id: result.user?.id,
            email: result.user?.email,
            name: result.user?.name,
            role: result.user?.role,
            emailVerified: result.user?.emailVerified,
            updatedAt: result.user?.updatedAt,
          },
        });
      }

      case "DELETE": {
        // Delete user
        const body = await request.json();
        const validatedData = deleteUserSchema.parse(body);

        const result = await deleteUserByAdmin(
          db,
          userSession.userId,
          validatedData.userId
        );

        if (!result.success) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        await logSecurityAccess(db, userSession.userId, request, "/api/admin/users", "high", {
          action: "user_deleted",
          targetUserId: validatedData.userId,
        });

        return Response.json({ success: true });
      }

      default:
        return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
  } catch (error) {
    console.error("Admin user management API error:", error);
    
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return Response.json(
      { error: "Operation failed" },
      { status: 500 }
    );
  }
}