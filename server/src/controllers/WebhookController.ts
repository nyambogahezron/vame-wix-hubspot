import type { Request, Response } from "express";
import { db } from "../database/connect.js";
import { integrations } from "../database/schema/index.js";
import { SyncService } from "../services/SyncService.js";
import { eq } from "drizzle-orm";

export async function handleWixWebhook(req: any, res: Response) {
	const event = req.wixData;
	console.log("[Wix Webhook] Received event:", event);

	try {
		const [integration] = await db
			.select()
			.from(integrations)
			.where(eq(integrations.wixSiteId, event.siteId))
			.limit(1);

		if (integration) {
			await SyncService.syncContact(integration.id, "wix", event.data);
		}
		res.status(200).send("OK");
	} catch (error) {
		console.error("Wix sync failed:", error);
		res.status(500).send("Internal Server Error");
	}
};

export async function handleHubSpotWebhook(req: Request, res: Response) {
	const events = req.body;
	console.log("[HubSpot Webhook] Received events:", events);

	try {
		for (const event of events) {
			const [integration] = await db
				.select()
				.from(integrations)
				.where(eq(integrations.hubspotPortalId, event.portalId.toString()))
				.limit(1);

			if (integration) {
				await SyncService.syncContact(integration.id, "hubspot", {
					id: event.objectId.toString(),
					properties: { [event.propertyName]: event.propertyValue },
				});
			}
		}
		res.status(200).send("OK");
	} catch (error) {
		console.error("HubSpot sync failed:", error);
		res.status(500).send("Internal Server Error");
	}
};
