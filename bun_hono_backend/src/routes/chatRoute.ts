import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

import type { AppVariables } from "../types/contextType";

import { requireAuth } from "../middlewares/requireAuthMiddleware";
import { requireGoogleAccount } from "../middlewares/requireGoogleAccountMiddleware";
import { withAgentContext } from "../middlewares/withAgentContextMiddleware";

import { gmailAgent } from "../agents/gmailAgent";

export const chatRoutes = new Hono<{ Variables: AppVariables }>();


const chatSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

chatRoutes.post(
  "/",
  requireAuth,
  requireGoogleAccount,
  withAgentContext,
  zValidator("json", chatSchema),
  async (c) => {
    const { prompt } = c.req.valid("json");

    const runtimeContext = c.get("runtimeContext");

    const result = await gmailAgent.generate(prompt, {
      runtimeContext,
    });

    return c.json({
      message: result.text,
    });
  }
);
