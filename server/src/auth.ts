import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import env from "./config/env.js";
import { db } from "./database/connect.js";
import * as authSchema from "./database/schema/auth-schema.js";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: authSchema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	secret: process.env["APP_AUTH_SECRET"] ?? process.env["BETTER_AUTH_SECRET"],
	baseURL: env.AUTH_BASE_URL,
	trustedOrigins: [env.CLIENT_ORIGIN, env.AUTH_BASE_URL],
});
