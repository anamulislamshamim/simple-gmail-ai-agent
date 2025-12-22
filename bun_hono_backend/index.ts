import { Hono } from "hono";
import { auth } from "./src/auth/betterAuth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chatRoutes } from "./src/routes/chatRoute";

const app = new Hono({ strict: false });

app.use(logger());

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
	return auth.handler(c.req.raw);
});

app.route("/api/chat", chatRoutes);

export default {
    port: 3000,
    fetch: app.fetch,
};