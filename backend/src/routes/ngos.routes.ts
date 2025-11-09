// src/routes/ngos.routes.ts
import { Router } from "express";
import {
  createNgo,
  listNgos,
  getNgo,
  updateNgo,
  toggleNgoStatus,
  verifyNgo
} from "../controllers/ngos.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import { validateCreateNgo } from "../utils/validators";

const router = Router();


router.get("/", listNgos);
router.get("/verify/:id", verifyNgo);
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
