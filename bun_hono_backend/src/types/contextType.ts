import type { RuntimeContext } from "@mastra/core/runtime-context";
import type { User } from "better-auth";

export type GoogleAccessToken = {
  providerId: "google";
  accessToken: string;
  accessTokenExpiresAt?: string | null;
  refreshToken?: string | null;
  scopes?: string[];
};

export type AppVariables = {
  user: User;
  googleAccount: GoogleAccessToken;
  runtimeContext: RuntimeContext<{
    accessToken: string;
  }>;
};
