import dotenv from "dotenv";
dotenv.config();

const port = Number(process.env["APP_PORT"]) || 3001;

const ENV = {
	PORT: port,
	DATABASE_URL: process.env["DATABASE_URL"],
	CLIENT_ORIGIN: process.env["APP_CLIENT_ORIGIN"] ?? "http://localhost:3000",
	AUTH_BASE_URL: process.env["APP_AUTH_BASE_URL"] ?? process.env["BETTER_AUTH_URL"] ?? `http://localhost:${port}`,
	WIX_APP_ID: process.env["WIX_APP_ID"],
	WIX_APP_SECRET: process.env["WIX_APP_SECRET"],
	WIX_PUBLIC_KEY: process.env["WIX_PUBLIC_KEY"],
	HUBSPOT_CLIENT_ID: process.env["HUBSPOT_CLIENT_ID"],
	HUBSPOT_CLIENT_SECRET: process.env["HUBSPOT_CLIENT_SECRET"],
	HUBSPOT_REDIRECT_URI: process.env["HUBSPOT_REDIRECT_URI"],
	HUBSPOT_DEVELOPER_API_KEY: process.env["HUBSPOT_DEVELOPER_API_KEY"],
};

export default ENV;