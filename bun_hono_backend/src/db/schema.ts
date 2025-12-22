import { pgTable, text, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("accounts", {
    userId: text("user_id").notNull(),
    provider: text("provider").notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at"),
});