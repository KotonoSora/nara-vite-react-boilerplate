import type { MiddlewareHandler } from "hono";

import { hasValidBasicAuth } from "./hasValidBasicAuth";
import { normalizeHost } from "./normalizeHost";

export const devDomainBasicAuthMiddleware: MiddlewareHandler<{
  Bindings: Env;
}> = async (c, next) => {
  const requestHost = normalizeHost(new URL(c.req.url).host);
  const configuredDevDomain = import.meta.env.VITE_DEV_DOMAIN;
  const devHost = normalizeHost(configuredDevDomain);

  // Enforce basic auth only on the development domain.
  if (requestHost && devHost && requestHost === devHost) {
    const username = c.env.BASIC_AUTH_USERNAME;
    const password = c.env.BASIC_AUTH_PASSWORD;

    if (
      !username ||
      !password ||
      !hasValidBasicAuth(c.req.raw, username, password)
    ) {
      return c.newResponse("Authentication required", 401, {
        "WWW-Authenticate": 'Basic realm="Development"',
      });
    }
  }

  return next();
};
