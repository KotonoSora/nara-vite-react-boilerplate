import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Extract client IP address from request headers
 */
export function getClientIPAddress(request: Request): string | undefined {
  // Check common headers for IP address in order of preference
  const headers = [
    "CF-Connecting-IP", // Cloudflare
    "X-Forwarded-For", // Standard proxy header
    "X-Real-IP", // Nginx
    "X-Client-IP", // Apache
    "X-Cluster-Client-IP", // Cluster
    "X-Forwarded", // Older standard
    "Forwarded-For", // RFC 7239
    "Forwarded", // RFC 7239
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // X-Forwarded-For can contain multiple IPs, take the first one
      const ip = value.split(",")[0].trim();
      if (ip && ip !== "unknown") {
        return ip;
      }
    }
  }

  return undefined;
}
