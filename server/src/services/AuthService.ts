import { Client } from "@hubspot/api-client";
import env from "../config/env.js";
import { db } from "../database/connect.js";
import { integrations } from "../database/schema/index.js";
import { eq } from "drizzle-orm";

const hubspotClient = new Client();

export class AuthService {
	static getHubSpotAuthUrl() {
		const scopes = ["crm.objects.contacts.read", "crm.objects.contacts.write", "crm.schemas.contacts.read"];
		return hubspotClient.oauth.getAuthorizationUrl(
			env.HUBSPOT_CLIENT_ID!,
			env.HUBSPOT_REDIRECT_URI!,
			scopes.join(" "),
		);
	}

	static async handleHubSpotCallback(code: string, wixSiteId: string) {
		const tokenResponse = await hubspotClient.oauth.tokensApi.create(
			"authorization_code",
			code,
			env.HUBSPOT_REDIRECT_URI,
			env.HUBSPOT_CLIENT_ID,
			env.HUBSPOT_CLIENT_SECRET,
		);

		const { accessToken, refreshToken, expiresIn } = tokenResponse;
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		// Get portal ID
		hubspotClient.setAccessToken(accessToken);
		const portalResponse = await hubspotClient.oauth.accessTokensApi.get(accessToken);
		const hubspotPortalId = portalResponse.hubId.toString();

		await db
			.insert(integrations)
			.values({
				wixSiteId,
				hubspotPortalId,
				accessToken,
				refreshToken,
				tokenExpiresAt: expiresAt,
			})
			.onConflictDoUpdate({
				target: integrations.wixSiteId,
				set: {
					hubspotPortalId,
					accessToken,
					refreshToken,
					tokenExpiresAt: expiresAt,
					updatedAt: new Date(),
				},
			});

		return { hubspotPortalId };
	}

	static async getValidToken(integrationId: number) {
		const [integration] = await db
			.select()
			.from(integrations)
			.where(eq(integrations.id, integrationId))
			.limit(1);

		if (!integration) throw new Error("Integration not found");

		if (integration.tokenExpiresAt && integration.tokenExpiresAt > new Date()) {
			return integration.accessToken;
		}

		// Refresh token
		const tokenResponse = await hubspotClient.oauth.tokensApi.create(
			"refresh_token",
			undefined,
			undefined,
			env.HUBSPOT_CLIENT_ID,
			env.HUBSPOT_CLIENT_SECRET,
			integration.refreshToken!,
		);

		const { accessToken, refreshToken, expiresIn } = tokenResponse;
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		await db
			.update(integrations)
			.set({
				accessToken,
				refreshToken,
				tokenExpiresAt: expiresAt,
				updatedAt: new Date(),
			})
			.where(eq(integrations.id, integrationId));

		return accessToken;
	}
}
