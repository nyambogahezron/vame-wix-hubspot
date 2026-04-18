import type { Request, Response } from "express";
import { db } from "../database/connect.js";
import { integrations, mappings } from "../database/schema/index.js";
import { eq } from "drizzle-orm";

export async function getMappings(req: Request, res: Response) {
	const { wixSiteId } = req.query;
	if (!wixSiteId) return res.status(400).json({ error: "Missing wixSiteId" });

	const [integration] = await db
		.select()
		.from(integrations)
		.where(eq(integrations.wixSiteId, wixSiteId as string))
		.limit(1);

	if (!integration) return res.status(404).json({ error: "Integration not found" });

	const results = await db
		.select()
		.from(mappings)
		.where(eq(mappings.integrationId, integration.id));
	return res.json(results);
};

export async function addMapping(req: Request, res: Response) {
	const { wixSiteId, wixField, hubspotProperty, direction, transform } = req.body;
	if (!wixSiteId) return res.status(400).json({ error: "Missing wixSiteId" });

	const [integration] = await db
		.select()
		.from(integrations)
		.where(eq(integrations.wixSiteId, wixSiteId as string))
		.limit(1);

	if (!integration) return res.status(404).json({ error: "Integration not found" });

	await db.insert(mappings).values({
		integrationId: integration.id,
		wixField,
		hubspotProperty,
		direction: direction || "both",
		transform,
	});

	return res.json({ message: "Mapping added" });
};
