import { Client } from "@hubspot/api-client";
import { db } from "../database/connect.js";
import { integrations, mappings, syncLedger } from "../database/schema/index.js";
import { eq, and } from "drizzle-orm";
import { AuthService } from "./AuthService.js";

const hubspotClient = new Client();

export class SyncService {
	static async syncContact(
		integrationId: number,
		source: "wix" | "hubspot",
		contactData: any,
	) {
		const [integration] = await db
			.select()
			.from(integrations)
			.where(eq(integrations.id, integrationId))
			.limit(1);

		if (!integration) throw new Error("Integration not found");

		const userMappings = await db
			.select()
			.from(mappings)
			.where(eq(mappings.integrationId, integrationId));

		// Check SyncLedger for loop prevention
		const [ledgerEntry] = await db
			.select()
			.from(syncLedger)
			.where(
				and(
					eq(syncLedger.integrationId, integrationId),
					source === "wix"
						? eq(syncLedger.wixContactId, contactData.id)
						: eq(syncLedger.hubspotContactId, contactData.id),
				),
			)
			.limit(1);

		if (ledgerEntry) {
			const now = Date.now();
			const lastSync = ledgerEntry.lastSyncedAt.getTime();
			// If last update was < 5 seconds ago from the same source, ignore it
			if (ledgerEntry.lastSource === source && now - lastSync < 5000) {
				console.log(`[SyncService] Ignoring loop update from ${source}`);
				return;
			}
		}

		if (source === "wix") {
			await this.syncToHubSpot(integration, userMappings, contactData, ledgerEntry);
		} else {
			await this.syncToWix(integration, userMappings, contactData, ledgerEntry);
		}
	}

	private static async syncToHubSpot(
		integration: any,
		userMappings: any[],
		wixContact: any,
		ledgerEntry: any,
	) {
		const hsProperties: any = {};
		for (const m of userMappings) {
			if (m.direction === "hs_to_wix") continue;
			const value = wixContact[m.wixField] || wixContact.info?.[m.wixField];
			if (value !== undefined) {
				hsProperties[m.hubspotProperty] = this.applyTransform(value, m.transform);
			}
		}

		const accessToken = await AuthService.getValidToken(integration.id);
		if (!accessToken) throw new Error("Missing HubSpot access token");
		hubspotClient.setAccessToken(accessToken);

		let hubspotContactId = ledgerEntry?.hubspotContactId;

		if (hubspotContactId) {
			// Update existing
			await hubspotClient.crm.contacts.basicApi.update(hubspotContactId, {
				properties: hsProperties,
			});
		} else {
			// Create new
			const createResponse = await hubspotClient.crm.contacts.basicApi.create({
				properties: hsProperties,
			});
			hubspotContactId = createResponse.id;
		}

		// Update Ledger
		await this.updateLedger(integration.id, wixContact.id, hubspotContactId, "wix");
	}

	private static async syncToWix(
		integration: any,
		userMappings: any[],
		hsContact: any,
		ledgerEntry: any,
	) {
		const wixData: any = {};
		for (const m of userMappings) {
			if (m.direction === "wix_to_hs") continue;
			const value = hsContact.properties[m.hubspotProperty];
			if (value !== undefined) {
				wixData[m.wixField] = this.applyTransform(value, m.transform);
			}
		}

		let wixContactId = ledgerEntry?.wixContactId;

		// Note: Wix API calls would happen here.
		// Since we don't have the Wix API URL or Client configured yet, we'll log it.
		console.log(`[SyncService] Would update Wix contact ${wixContactId || "new"} with:`, wixData);

		// Example Wix Update (Pseudo-code)
		// await axios.patch(`https://www.wixapis.com/contacts/v1/contacts/${wixContactId}`, wixData, { ... })

		// Update Ledger (assuming Wix ID exists or was created)
		if (wixContactId) {
			await this.updateLedger(integration.id, wixContactId, hsContact.id, "hubspot");
		}
	}

	private static applyTransform(value: any, transform?: string | null) {
		if (!transform || typeof value !== "string") return value;
		switch (transform) {
			case "lowercase":
				return value.toLowerCase();
			case "trim":
				return value.trim();
			default:
				return value;
		}
	}

	private static async updateLedger(
		integrationId: number,
		wixContactId: string,
		hubspotContactId: string,
		source: "wix" | "hubspot",
	) {
		await db
			.insert(syncLedger)
			.values({
				integrationId,
				wixContactId,
				hubspotContactId,
				lastSource: source,
				lastSyncedAt: new Date(),
			})
			.onConflictDoUpdate({
				target: [syncLedger.integrationId, syncLedger.wixContactId], // Simplified target for example
				set: {
					hubspotContactId,
					lastSource: source,
					lastSyncedAt: new Date(),
				},
			});
	}
}
