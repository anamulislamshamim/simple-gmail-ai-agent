import { RuntimeContext } from "@mastra/core/runtime-context";
import type { MiddlewareHandler } from "hono";

export const withAgentContext: MiddlewareHandler = async (c, next) => {
  const googleAccount = c.get("googleAccount");

  // Type your context for better safety
  const runtimeContext = new RuntimeContext<{
    accessToken: string;
  }>();

  if (googleAccount?.accessToken) {
    runtimeContext.set("accessToken", googleAccount.accessToken);
  }

  // Store the actual instance in Hono context
  c.set("runtimeContext", runtimeContext);
  await next();
};