import { db } from "../database/connect.js";
import { integrations } from "../database/schema/index.js";
import { eq } from "drizzle-orm";
export async function getIntegration(req, res) {
    const { wixSiteId } = req.query;
    if (!wixSiteId || typeof wixSiteId !== "string") {
        return res.status(400).json({ error: "Missing wixSiteId" });
    }
    const [integration] = await db
        .select({
        wixSiteId: integrations.wixSiteId,
        hubspotPortalId: integrations.hubspotPortalId,
    })
        .from(integrations)
        .where(eq(integrations.wixSiteId, wixSiteId))
        .limit(1);
    if (!integration) {
        return res.json({
            wixSiteId,
            connected: false,
            hubspotPortalId: null,
        });
    }
    return res.json({
        wixSiteId: integration.wixSiteId,
        connected: Boolean(integration.hubspotPortalId),
        hubspotPortalId: integration.hubspotPortalId,
    });
}
//# sourceMappingURL=IntegrationController.js.map