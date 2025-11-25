// src/routes/admin.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { getAllDonors } from '../controllers/admin.controller';
import { getAdminStats } from "../controllers/admin.controller";

const router = Router();

router.get('/stats', authMiddleware, roleMiddleware(['admin']), getAdminStats);
router.get(
  '/donors',
  authMiddleware,
  roleMiddleware(['admin']),
  getAllDonors
);

export default router;
