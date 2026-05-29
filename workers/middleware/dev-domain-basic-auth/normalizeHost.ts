export function normalizeHost(value: string | undefined): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return new URL(withProtocol).host.toLowerCase();
  } catch {
    return (
      trimmed
        .toLowerCase()
        .replace(/^https?:\/\//i, "")
        .split("/")[0] || null
    );
  }
}
