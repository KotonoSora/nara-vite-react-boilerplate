export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
}

export function generateSessionId(): string {
  return crypto.randomUUID();
}

export function getSessionExpiry(): Date {
  const now = new Date();
  // Session expires in 30 days
  now.setDate(now.getDate() + 30);
  return now;
}
