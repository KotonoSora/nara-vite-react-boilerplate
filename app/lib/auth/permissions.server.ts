import { eq, and, or } from "drizzle-orm";
import type { DrizzleD1Database } from "drizzle-orm/d1";

import * as schema from "~/database/schema";

const { user, permission, rolePermission, userPermission } = schema;

export interface Permission {
  id: number;
  name: string;
  description: string | null;
  resource: string;
  action: string;
}

export interface UserWithPermissions {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
  permissions: Permission[];
}

// Default permissions for roles
export const DEFAULT_PERMISSIONS = {
  admin: [
    // Admin can do everything
    { name: "admin.manage", description: "Full admin access", resource: "admin", action: "manage" },
    { name: "user.create", description: "Create users", resource: "user", action: "create" },
    { name: "user.read", description: "View users", resource: "user", action: "read" },
    { name: "user.update", description: "Update users", resource: "user", action: "update" },
    { name: "user.delete", description: "Delete users", resource: "user", action: "delete" },
    { name: "profile.read", description: "View own profile", resource: "profile", action: "read" },
    { name: "profile.update", description: "Update own profile", resource: "profile", action: "update" },
  ],
  user: [
    // Regular user permissions
    { name: "profile.read", description: "View own profile", resource: "profile", action: "read" },
    { name: "profile.update", description: "Update own profile", resource: "profile", action: "update" },
  ],
} as const;

/**
 * Initialize default permissions in the database
 */
export async function initializePermissions(
  db: DrizzleD1Database<typeof schema>
): Promise<void> {
  // Insert all unique permissions
  const allPermissions = [
    ...DEFAULT_PERMISSIONS.admin,
    ...DEFAULT_PERMISSIONS.user,
  ];

  // Remove duplicates based on name
  const uniquePermissions = allPermissions.filter(
    (perm, index, self) => self.findIndex(p => p.name === perm.name) === index
  );

  for (const perm of uniquePermissions) {
    try {
      await db
        .insert(permission)
        .values(perm)
        .onConflictDoNothing({ target: permission.name });
    } catch (error) {
      // Permission might already exist, continue
      console.warn(`Permission ${perm.name} might already exist`);
    }
  }

  // Set up role-permission relationships
  for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    for (const perm of permissions) {
      try {
        // Get permission ID
        const [existingPermission] = await db
          .select({ id: permission.id })
          .from(permission)
          .where(eq(permission.name, perm.name))
          .limit(1);

        if (existingPermission) {
          await db
            .insert(rolePermission)
            .values({
              role: role as "admin" | "user",
              permissionId: existingPermission.id,
            })
            .onConflictDoNothing({ target: [rolePermission.role, rolePermission.permissionId] });
        }
      } catch (error) {
        console.warn(`Failed to assign permission ${perm.name} to role ${role}`);
      }
    }
  }
}

/**
 * Get all permissions for a user (role + user-specific permissions)
 */
export async function getUserPermissions(
  db: DrizzleD1Database<typeof schema>,
  userId: number
): Promise<Permission[]> {
  const [userData] = await db
    .select({ role: user.role })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!userData) {
    return [];
  }

  // Get role-based permissions
  const rolePermissions = await db
    .select({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
    })
    .from(permission)
    .innerJoin(rolePermission, eq(permission.id, rolePermission.permissionId))
    .where(eq(rolePermission.role, userData.role));

  // Get user-specific permissions
  const specificPermissions = await db
    .select({
      id: permission.id,
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      granted: userPermission.granted,
    })
    .from(permission)
    .innerJoin(userPermission, eq(permission.id, userPermission.permissionId))
    .where(eq(userPermission.userId, userId));

  // Combine permissions, with user-specific overriding role permissions
  const permissionMap = new Map<string, Permission>();

  // Add role permissions first
  for (const perm of rolePermissions) {
    permissionMap.set(perm.name, perm);
  }

  // Override with user-specific permissions
  for (const perm of specificPermissions) {
    if (perm.granted) {
      permissionMap.set(perm.name, {
        id: perm.id,
        name: perm.name,
        description: perm.description,
        resource: perm.resource,
        action: perm.action,
      });
    } else {
      // User-specific denial removes the permission
      permissionMap.delete(perm.name);
    }
  }

  return Array.from(permissionMap.values());
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  permissionName: string
): Promise<boolean> {
  const permissions = await getUserPermissions(db, userId);
  return permissions.some(p => p.name === permissionName);
}

/**
 * Check if a user can perform an action on a resource
 */
export async function canUserPerform(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  resource: string,
  action: string
): Promise<boolean> {
  const permissions = await getUserPermissions(db, userId);
  
  // Check for exact match
  const hasExactPermission = permissions.some(
    p => p.resource === resource && p.action === action
  );

  if (hasExactPermission) {
    return true;
  }

  // Check for wildcard permissions (admin.manage covers everything)
  const hasWildcardPermission = permissions.some(
    p => p.resource === "admin" && p.action === "manage"
  );

  return hasWildcardPermission;
}

/**
 * Grant a permission to a user
 */
export async function grantPermissionToUser(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  permissionName: string
): Promise<void> {
  const [perm] = await db
    .select({ id: permission.id })
    .from(permission)
    .where(eq(permission.name, permissionName))
    .limit(1);

  if (!perm) {
    throw new Error(`Permission ${permissionName} not found`);
  }

  await db
    .insert(userPermission)
    .values({
      userId,
      permissionId: perm.id,
      granted: true,
    })
    .onConflictDoUpdate({
      target: [userPermission.userId, userPermission.permissionId],
      set: { granted: true },
    });
}

/**
 * Revoke a permission from a user
 */
export async function revokePermissionFromUser(
  db: DrizzleD1Database<typeof schema>,
  userId: number,
  permissionName: string
): Promise<void> {
  const [perm] = await db
    .select({ id: permission.id })
    .from(permission)
    .where(eq(permission.name, permissionName))
    .limit(1);

  if (!perm) {
    throw new Error(`Permission ${permissionName} not found`);
  }

  await db
    .insert(userPermission)
    .values({
      userId,
      permissionId: perm.id,
      granted: false,
    })
    .onConflictDoUpdate({
      target: [userPermission.userId, userPermission.permissionId],
      set: { granted: false },
    });
}

/**
 * Middleware-friendly permission checker
 */
export function createPermissionChecker(
  db: DrizzleD1Database<typeof schema>
) {
  return {
    async requirePermission(userId: number, permissionName: string): Promise<void> {
      const hasRequiredPermission = await hasPermission(db, userId, permissionName);
      if (!hasRequiredPermission) {
        throw new Response("Forbidden: Insufficient permissions", { status: 403 });
      }
    },

    async requireResourceAction(userId: number, resource: string, action: string): Promise<void> {
      const canPerform = await canUserPerform(db, userId, resource, action);
      if (!canPerform) {
        throw new Response(`Forbidden: Cannot ${action} ${resource}`, { status: 403 });
      }
    },

    async requireAdmin(userId: number): Promise<void> {
      const hasAdminAccess = await hasPermission(db, userId, "admin.manage");
      if (!hasAdminAccess) {
        throw new Response("Forbidden: Admin access required", { status: 403 });
      }
    },
  };
}

/**
 * Standalone admin role checker
 */
export async function requireAdminRole(
  db: DrizzleD1Database<typeof schema>,
  userId: number
): Promise<void> {
  const foundUser = await db
    .select()
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (!foundUser[0]) {
    throw new Response("User not found", { status: 404 });
  }

  if (foundUser[0].role !== "admin") {
    throw new Response("Forbidden: Admin access required", { status: 403 });
  }
}