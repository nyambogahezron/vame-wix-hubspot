import { Router } from "express";
import { startHubSpotAuth, hubspotCallback } from "../controllers/AuthController.js";

const router = Router();

router.get("/hubspot", startHubSpotAuth);
router.get("/hubspot/callback", hubspotCallback);

export default router;
