import { AuthService } from "../services/AuthService.js";
export async function startHubSpotAuth(req, res) {
    const state = typeof req.query["state"] === "string" ? req.query["state"] : undefined;
    const url = AuthService.getHubSpotAuthUrl(state);
    res.redirect(url);
}
export async function hubspotCallback(req, res) {
    const { code, state } = req.query;
    const wixSiteId = state || "test-site-id";
    try {
        const result = await AuthService.handleHubSpotCallback(code, wixSiteId);
        res.json({ message: "HubSpot connected successfully!", ...result });
    }
    catch (error) {
        console.error("HubSpot OAuth failed:", error);
        res.status(500).json({ error: "Failed to connect HubSpot" });
    }
}
;
//# sourceMappingURL=AuthController.js.map