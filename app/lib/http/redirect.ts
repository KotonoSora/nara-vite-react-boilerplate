import { data, redirect } from "react-router";

/**
 * Redirect back to the Referer if present, otherwise to fallback (default "/").
 * Optionally include extra headers (e.g., Set-Cookie).
 */
export function redirectBack(
  request: Request,
  opts?: { fallback?: string; headers?: HeadersInit },
) {
  const referer = request.headers.get("referer");
  return redirect(referer || opts?.fallback || "/", {
    headers: opts?.headers,
  });
}

/**
 * Convenience for 302 data redirect with Location header.
 */
export function redirectWithHeaders(location: string, headers?: HeadersInit) {
  return data(
    {},
    {
      status: 302,
      headers: {
        Location: location,
        ...(headers || {}),
      },
    },
  );
}
