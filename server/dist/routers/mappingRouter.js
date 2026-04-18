import { Router } from "express";
import { getMappings, addMapping } from "../controllers/MappingController.js";
const router = Router();
router.get("/", getMappings);
router.post("/", addMapping);
export default router;
//# sourceMappingURL=mappingRouter.js.map