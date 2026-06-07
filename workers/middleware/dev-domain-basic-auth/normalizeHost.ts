export function normalizeHost(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // Accept "example.com", "https://example.com", "http://example.com",
  // and accidental chained schemes like "https://https://example.com".
  const withoutProtocol = trimmed.replace(/^(?:(?:https?):\/\/)+/i, "");
  if (!withoutProtocol) return null;

  // Reject non-http(s) scheme injection after stripping leading protocols.
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(withoutProtocol)) return null;

  try {
    return new URL(`https://${withoutProtocol}`).host.toLowerCase();
  } catch {
    const fallbackHost = withoutProtocol
      .toLowerCase()
      .split("/")[0]
      .split("?")[0]
      .split("#")[0];
    return fallbackHost || null;
  }
}
