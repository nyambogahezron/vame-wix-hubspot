import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const verifyHubSpotSignature = (req: Request, res: Response, next: NextFunction) => {
	const signature = req.header("X-HubSpot-Signature-v3");
	const timestamp = req.header("X-HubSpot-Request-Timestamp");

	if (!signature || !timestamp) {
		return res.status(401).json({ message: "Missing HubSpot signature or timestamp" });
	}

	// Validate timestamp (5 minute window)
	const now = Date.now();
	const requestTime = Number.parseInt(timestamp);
	if (Math.abs(now - requestTime) > 300000) {
		return res.status(401).json({ message: "Request timestamp too old" });
	}

	const method = req.method;
	const protocol = req.protocol;
	const host = req.get("host");
	const uri = `${protocol}://${host}${req.originalUrl}`;
	const rawBody = (req as any).rawBody?.toString() || "";

	const sourceString = method + uri + rawBody + timestamp;
	const hash = crypto
		.createHmac("sha256", env.HUBSPOT_CLIENT_SECRET!)
		.update(sourceString)
		.digest("base64");

	try {
		if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature))) {
			return next();
		}
	} catch (e) {
		// Ignore timingSafeEqual errors (like length mismatch)
	}

	return res.status(401).json({ message: "Invalid HubSpot signature" });
};

export const verifyWixSignature = (req: Request, res: Response, next: NextFunction) => {
	const token = req.body; // Wix sends JWT as raw body
	if (typeof token !== "string") {
		return res.status(401).json({ message: "Invalid Wix payload (expected JWT string)" });
	}

	const publicKey = `-----BEGIN PUBLIC KEY-----\n${env.WIX_PUBLIC_KEY}\n-----END PUBLIC KEY-----`;

	try {
		const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
		(req as any).wixData = decoded;
		return next();
	} catch (err) {
		console.error("Wix signature verification failed:", err);
		return res.status(401).json({ message: "Invalid Wix signature" });
	}
};
