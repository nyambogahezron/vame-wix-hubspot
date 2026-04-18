import { Router } from "express";
import { getIntegration } from "../controllers/IntegrationController.js";
const router = Router();
router.get("/", getIntegration);
export default router;
//# sourceMappingURL=integrationRouter.js.map