// src/routes/ngos.routes.ts
import { Router } from "express";
import {
  createNgo,
  listNgos,
  getNgo,
  updateNgo,
  toggleNgoStatus,
} from "../controllers/ngos.controller";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import { validateCreateNgo } from "../utils/validators";

const router = Router();

// רשימת עמותות וצפייה בעמותה
router.get("/", listNgos);
router.get("/:id", getNgo);

// ✅ ניהול סטטוס עמותה (מנהל מערכת בלבד)
router.patch(
  "/:id/toggle-status",
  authMiddleware,
  roleMiddleware(["admin"]),
  toggleNgoStatus
);

// ✅ יצירה ועדכון עמותה (עמותה עצמה או אדמין)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["manager", "admin"]),
  validateCreateNgo,
  createNgo
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["manager", "admin"]),
  updateNgo
);

export default router;
