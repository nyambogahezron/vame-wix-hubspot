import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import env from "./config/env.js";
import { auth } from "./auth.js";
import authRouter from "./routers/authRouter.js";
import webhookRouter from "./routers/webhookRouter.js";
import mappingRouter from "./routers/mappingRouter.js";
import integrationRouter from "./routers/integrationRouter.js";

const app = express();

app.use(
	cors({
		origin: env.CLIENT_ORIGIN,
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
	}),
);
app.use(morgan("dev"));

// Better Auth must run before express.json() (see Better Auth Express docs).
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(
	bodyParser.json({
		verify: (req: express.Request & { rawBody?: Buffer }, _res, buf) => {
			req.rawBody = buf;
		},
	}),
);

app.use("/auth", authRouter);
app.use("/webhooks", webhookRouter);
app.use("/api/mappings", mappingRouter);
app.use("/api/integration", integrationRouter);

app.get("/api/status", (_req, res) => {
	res.json({ status: "ok", service: "wix-hubspot-integration" });
});

app.get("/api/session", async (req, res) => {
	const session = await auth.api.getSession({
		headers: fromNodeHeaders(req.headers),
	});
	res.json(session);
});

const PORT = env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
