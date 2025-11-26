// src/routes/ngos.routes.ts
import { Router } from "express";
import {
  createNgo,
  listNgos,
  getNgo,
  updateNgo,
  toggleNgoStatus,
  verifyNgo,
  getNgoTags,
  aiSearchNgo
} from "../controllers/ngos.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import { validateCreateNgo } from "../utils/validators";

const router = Router();
// Routes for managing NGOs (Non-Governmental Organizations).
// - GET "/" lists all NGOs.
// - GET "/verify/:id" verifies NGO status.
// - GET "/tags" returns all available NGO tags.
// - GET "/search" allows AI-based NGO search.
// - GET "/:id" fetches a specific NGO by ID.
// - PATCH "/:id/toggle-status" allows admins to activate/deactivate an NGO.
// - POST "/" allows managers to create a new NGO (with validation).
// - PUT "/:id" allows managers to update an existing NGO.
router.get("/", listNgos);
router.get("/verify/:id", verifyNgo);
router.get('/tags', getNgoTags);
router.get('/search', aiSearchNgo);
router.get("/:id", getNgo);


router.patch(
  "/:id/toggle-status",
  authMiddleware,
  roleMiddleware(["admin"]),
  toggleNgoStatus
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["manager"]),
  validateCreateNgo,
  createNgo
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["manager"]),
  updateNgo
);

export default router;
