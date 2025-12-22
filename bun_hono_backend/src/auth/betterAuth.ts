import { betterAuth } from "better-auth";
import { env } from "../env";
import { pool } from "../db/client";
import { redis } from "../redis/client";

export const auth = betterAuth({
	baseURL: "http://localhost:3000",
    basePath: "/api/auth",
	secret: "hgq3rhi13sr0r7sfqoWuWKDCigfkeldklfklxlke;xxsfedku574MgTeC",
	database: pool,
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
		},
	},
	
	trustedOrigins: [
		"http://localhost:5173", 
	],

    advanced: {
        cookiePrefix: "session",
        useSecureCookies: false,
    },
    cookie: {
        sameSite: "lax", 
        secure: false,
    },
	secondaryStorage: {
		get: async (key) => {
			const val = await redis.get(key);
			return val;
		},
		set: async (key, value, ttl) => {
			if (ttl) await redis.set(key, value, "EX", ttl);
			else await redis.set(key, value);
		},
		delete: async (key) => {
			await redis.del(key);
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
	},
});