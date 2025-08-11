import crypto from "crypto";

import { and, desc, eq } from "drizzle-orm";

import type { Database } from "~/lib/types";

import { securityAuditLog, trustedDevice } from "~/database/schema/user";

/**
 * Generate device fingerprint from request headers
 */
export function generateDeviceFingerprint(
  userAgent: string,
  acceptLanguage?: string,
  acceptEncoding?: string,
): string {
  const data = `${userAgent}|${acceptLanguage || ""}|${acceptEncoding || ""}`;
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Extract device information from user agent
 */
export function parseDeviceInfo(userAgent: string) {
  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  const isTablet = /iPad|Tablet/.test(userAgent);

  let os = "Unknown";
  if (/Windows/.test(userAgent)) os = "Windows";
  else if (/Mac OS/.test(userAgent)) os = "macOS";
  else if (/Linux/.test(userAgent)) os = "Linux";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/iOS|iPhone|iPad/.test(userAgent)) os = "iOS";

  let browser = "Unknown";
  if (/Chrome/.test(userAgent)) browser = "Chrome";
  else if (/Firefox/.test(userAgent)) browser = "Firefox";
  else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent))
    browser = "Safari";
  else if (/Edge/.test(userAgent)) browser = "Edge";

  let deviceType = "Desktop";
  if (isMobile) deviceType = "Mobile";
  else if (isTablet) deviceType = "Tablet";

  return {
    deviceType,
    os,
    browser,
    isMobile,
    isTablet,
  };
}

/**
 * Track a device for a user
 */
export async function trackDevice(
  db: Database,
  userId: number,
  request: Request,
  options: {
    trustDevice?: boolean;
    deviceName?: string;
  } = {},
) {
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";
  const ipAddress =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "unknown";

  const deviceFingerprint = generateDeviceFingerprint(
    userAgent,
    acceptLanguage,
    acceptEncoding,
  );
  const deviceInfo = parseDeviceInfo(userAgent);

  const deviceName =
    options.deviceName ||
    `${deviceInfo.deviceType} (${deviceInfo.browser} on ${deviceInfo.os})`;

  // Check if device already exists
  const existingDevice = await db
    .select()
    .from(trustedDevice)
    .where(
      and(
        eq(trustedDevice.userId, userId),
        eq(trustedDevice.deviceFingerprint, deviceFingerprint),
      ),
    )
    .get();

  if (existingDevice) {
    // Update last seen
    await db
      .update(trustedDevice)
      .set({
        lastSeenAt: new Date(),
        ipAddress,
        isTrusted: options.trustDevice ?? existingDevice.isTrusted,
      })
      .where(eq(trustedDevice.id, existingDevice.id));

    return existingDevice;
  } else {
    // Create new device record
    const newDevice = await db
      .insert(trustedDevice)
      .values({
        userId,
        deviceFingerprint,
        deviceName,
        userAgent,
        ipAddress,
        lastSeenAt: new Date(),
        isTrusted: options.trustDevice || false,
      })
      .returning()
      .get();

    // Log device registration
    await logSecurityEvent(
      db,
      userId,
      "device_registered",
      "device",
      {
        deviceFingerprint,
        deviceName,
        ipAddress,
        userAgent,
      },
      request,
    );

    return newDevice;
  }
}

/**
 * Check if device is trusted
 */
export async function isDeviceTrusted(
  db: Database,
  userId: number,
  request: Request,
): Promise<boolean> {
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";

  const deviceFingerprint = generateDeviceFingerprint(
    userAgent,
    acceptLanguage,
    acceptEncoding,
  );

  const device = await db
    .select()
    .from(trustedDevice)
    .where(
      and(
        eq(trustedDevice.userId, userId),
        eq(trustedDevice.deviceFingerprint, deviceFingerprint),
        eq(trustedDevice.isTrusted, true),
      ),
    )
    .get();

  return !!device;
}

/**
 * Get user's devices
 */
export async function getUserDevices(db: Database, userId: number) {
  return await db
    .select()
    .from(trustedDevice)
    .where(eq(trustedDevice.userId, userId))
    .orderBy(desc(trustedDevice.lastSeenAt))
    .all();
}

/**
 * Trust a device
 */
export async function trustDevice(
  db: Database,
  userId: number,
  deviceId: number,
  request: Request,
) {
  const device = await db
    .update(trustedDevice)
    .set({
      isTrusted: true,
    })
    .where(
      and(eq(trustedDevice.id, deviceId), eq(trustedDevice.userId, userId)),
    )
    .returning()
    .get();

  if (device) {
    await logSecurityEvent(
      db,
      userId,
      "device_trusted",
      "device",
      {
        deviceId,
        deviceFingerprint: device.deviceFingerprint,
      },
      request,
    );
  }

  return device;
}

/**
 * Revoke device trust
 */
export async function revokeDeviceTrust(
  db: Database,
  userId: number,
  deviceId: number,
  request: Request,
) {
  const device = await db
    .update(trustedDevice)
    .set({
      isTrusted: false,
    })
    .where(
      and(eq(trustedDevice.id, deviceId), eq(trustedDevice.userId, userId)),
    )
    .returning()
    .get();

  if (device) {
    await logSecurityEvent(
      db,
      userId,
      "device_trust_revoked",
      "device",
      {
        deviceId,
        deviceFingerprint: device.deviceFingerprint,
      },
      request,
    );
  }

  return device;
}

/**
 * Remove device
 */
export async function removeDevice(
  db: Database,
  userId: number,
  deviceId: number,
  request: Request,
) {
  const device = await db
    .select()
    .from(trustedDevice)
    .where(
      and(eq(trustedDevice.id, deviceId), eq(trustedDevice.userId, userId)),
    )
    .get();

  if (device) {
    await db.delete(trustedDevice).where(eq(trustedDevice.id, deviceId));

    await logSecurityEvent(
      db,
      userId,
      "device_removed",
      "device",
      {
        deviceId,
        deviceFingerprint: device.deviceFingerprint,
      },
      request,
    );
  }

  return device;
}

/**
 * Log security events for audit trail
 */
export async function logSecurityEvent(
  db: Database,
  userId: number | null,
  action: string,
  resource?: string,
  details?: Record<string, any>,
  request?: Request,
  success: boolean = true,
) {
  const ipAddress =
    request?.headers.get("cf-connecting-ip") ||
    request?.headers.get("x-forwarded-for") ||
    "unknown";
  const userAgent = request?.headers.get("user-agent") || "";
  const deviceFingerprint = request
    ? generateDeviceFingerprint(
        userAgent,
        request.headers.get("accept-language") || "",
        request.headers.get("accept-encoding") || "",
      )
    : undefined;

  await db.insert(securityAuditLog).values({
    userId,
    action,
    resource,
    ipAddress,
    userAgent,
    deviceFingerprint,
    details: details ? JSON.stringify(details) : null,
    success,
  });
}

/**
 * Get security audit logs for a user
 */
export async function getUserSecurityLogs(
  db: Database,
  userId: number,
  limit: number = 50,
) {
  return await db
    .select()
    .from(securityAuditLog)
    .where(eq(securityAuditLog.userId, userId))
    .orderBy(desc(securityAuditLog.createdAt))
    .limit(limit)
    .all();
}

/**
 * Detect suspicious activity based on patterns
 */
export async function detectSuspiciousActivity(
  db: Database,
  userId: number,
): Promise<{
  hasMultipleLocations: boolean;
  hasUnusualDevices: boolean;
  hasRecentFailures: boolean;
  recommendations: string[];
}> {
  const recentLogs = await db
    .select()
    .from(securityAuditLog)
    .where(eq(securityAuditLog.userId, userId))
    .orderBy(desc(securityAuditLog.createdAt))
    .limit(100)
    .all();

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentActivities = recentLogs.filter(
    (log: typeof securityAuditLog.$inferSelect) =>
      log.createdAt && log.createdAt > last24Hours,
  );

  // Check for multiple IP addresses in recent activity
  const uniqueIPs = new Set(
    recentActivities.map(
      (log: typeof securityAuditLog.$inferSelect) => log.ipAddress,
    ),
  );
  const hasMultipleLocations = uniqueIPs.size > 3;

  // Check for new/untrusted devices
  const deviceFingerprints = new Set(
    recentActivities.map(
      (log: typeof securityAuditLog.$inferSelect) => log.deviceFingerprint,
    ),
  );
  const devices = await db
    .select()
    .from(trustedDevice)
    .where(eq(trustedDevice.userId, userId))
    .all();

  const trustedFingerprints = new Set(
    devices
      .filter((d: typeof trustedDevice.$inferSelect) => d.isTrusted)
      .map((d: typeof trustedDevice.$inferSelect) => d.deviceFingerprint),
  );

  const hasUnusualDevices = Array.from(deviceFingerprints).some(
    (fp) => fp && !trustedFingerprints.has(fp),
  );

  // Check for recent failed login attempts
  const failedLogins = recentActivities.filter(
    (log: typeof securityAuditLog.$inferSelect) =>
      log.action === "login" && !log.success,
  );
  const hasRecentFailures = failedLogins.length > 2;

  // Generate recommendations
  const recommendations: string[] = [];

  if (hasMultipleLocations) {
    recommendations.push(
      "Multiple locations detected. Consider enabling MFA if not already enabled.",
    );
  }

  if (hasUnusualDevices) {
    recommendations.push(
      "New devices detected. Review and trust devices you recognize.",
    );
  }

  if (hasRecentFailures) {
    recommendations.push(
      "Recent failed login attempts detected. Change your password if suspicious.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "No suspicious activity detected. Your account appears secure.",
    );
  }

  return {
    hasMultipleLocations,
    hasUnusualDevices,
    hasRecentFailures,
    recommendations,
  };
}
