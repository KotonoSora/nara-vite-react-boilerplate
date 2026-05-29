export function hasValidBasicAuth(
  request: Request,
  username: string,
  password: string,
): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  const encoded = authHeader.slice(6).trim();
  if (!encoded) return false;

  try {
    const decoded = atob(encoded);
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return false;

    const receivedUser = decoded.slice(0, separatorIndex);
    const receivedPassword = decoded.slice(separatorIndex + 1);

    return receivedUser === username && receivedPassword === password;
  } catch {
    return false;
  }
}
