import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import env from "./config/env.js";
import authRouter from "./routers/authRouter.js";
import webhookRouter from "./routers/webhookRouter.js";
import mappingRouter from "./routers/mappingRouter.js";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(
	bodyParser.json({
		verify: (req: any, _res, buf) => {
			req.rawBody = buf;
		},
	}),
);

app.use("/auth", authRouter);
app.use("/webhooks", webhookRouter);
app.use("/api/mappings", mappingRouter);

app.get("/api/status", (_req, res) => {
	res.json({ status: "ok", service: "wix-hubspot-integration" });
});

const PORT = env.PORT;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});