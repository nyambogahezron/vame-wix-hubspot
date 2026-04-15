import { Router, text } from "express";
import { handleWixWebhook, handleHubSpotWebhook } from "../controllers/WebhookController.js";
import { verifyHubSpotSignature, verifyWixSignature } from "../middleware/verification.js";

const router = Router();

router.post("/wix", text({ type: "*/*" }), verifyWixSignature, handleWixWebhook);
router.post("/hubspot", verifyHubSpotSignature, handleHubSpotWebhook);

export default router;
