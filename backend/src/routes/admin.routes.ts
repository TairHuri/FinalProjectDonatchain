// src/routes/admin.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { getAdminStats, toggleCampignStatus, toggleCampignsStatus, getAllDonors } from "../controllers/admin.controller";


const router = Router();

router.patch('/campaigns/:campaignId', authMiddleware, roleMiddleware(['admin']), toggleCampignStatus)
router.patch('/ngos/:ngoId', authMiddleware, roleMiddleware(['admin']), toggleCampignsStatus)
router.get('/stats', authMiddleware, roleMiddleware(['admin']), getAdminStats);
router.get(
  '/donors',
  authMiddleware,
  roleMiddleware(['admin']),
  getAllDonors
);

export default router;
