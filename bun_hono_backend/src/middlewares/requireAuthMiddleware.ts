import { auth } from "../auth/betterAuth";
import type { MiddlewareHandler } from "hono";
import type { AppVariables } from "../types/contextType";


export const requireAuth: MiddlewareHandler<{
  Variables: Pick<AppVariables, "user">;
}> = async (c, next) => {
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });

    if (!session) {
        return c.json({ error: "Unauthorized", redirectTo: "/login"}, 401);
    }

    c.set("user", session.user);

    await next();
}