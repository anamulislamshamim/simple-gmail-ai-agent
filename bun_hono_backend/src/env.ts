import { z } from "zod";


export const env = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),

  GEMINI_API_KEY: z.string(),
  BETTER_AUTH_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
}).parse(process.env);