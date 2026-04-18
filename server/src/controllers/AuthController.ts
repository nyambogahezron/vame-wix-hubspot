import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export async function startHubSpotAuth(req: Request, res: Response) {
	const state = typeof req.query["state"] === "string" ? req.query["state"] : undefined;
	const url = AuthService.getHubSpotAuthUrl(state);
	res.redirect(url);
}

export async function hubspotCallback(req: Request, res: Response) {
	const { code, state } = req.query;
	const wixSiteId = (state as string) || "test-site-id";

	try {
		const result = await AuthService.handleHubSpotCallback(code as string, wixSiteId);
		res.json({ message: "HubSpot connected successfully!", ...result });
	} catch (error) {
		console.error("HubSpot OAuth failed:", error);
		res.status(500).json({ error: "Failed to connect HubSpot" });
	}
};
