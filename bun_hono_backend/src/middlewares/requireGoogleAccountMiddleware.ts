import type { MiddlewareHandler } from "hono";
import { auth } from "../auth/betterAuth";

export const requireGoogleAccount: MiddlewareHandler = async (c, next) => {
  let result;

  try {
    result = await auth.api.getAccessToken({
      body: {
        providerId: "google",
      },
      headers: c.req.raw.headers,
    });
  } catch {
    return c.json(
      { error: "Unauthorized", redirectTo: "/login" },
      401
    );
  }

  if (!result?.accessToken) {
    return c.json(
      {
        error: "Google account not connected",
        redirectTo: "/login",
      },
      401
    );
  }

  const expiresAt = result.accessTokenExpiresAt
    ? new Date(result.accessTokenExpiresAt).getTime()
    : null;

  if (expiresAt && Date.now() > expiresAt - 30_000) {
    return c.json(
      {
        error: "Session expired",
        message: "Your Google access expired. Please log in again.",
        redirectTo: "/login",
      },
      401
    );
  }

  c.set("googleAccount", result);
  await next();
};
