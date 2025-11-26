// src/routes/admin.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { getAdminStats, toggleCampignStatus, toggleCampignsStatus, getAllDonors } from "../controllers/admin.controller";


const router = Router();
// PATCH route to toggle the status of a single campaign
// Only accessible by authenticated users with 'admin' role
router.patch('/campaigns/:campaignId', authMiddleware, roleMiddleware(['admin']), toggleCampignStatus)
// PATCH route to toggle the status of all campaigns for a specific NGO
// Only accessible by authenticated users with 'admin' role
router.patch('/ngos/:ngoId', authMiddleware, roleMiddleware(['admin']), toggleCampignsStatus)
// GET route to retrieve admin dashboard statistics
// Only accessible by authenticated users with 'admin' role
router.get('/stats', authMiddleware, roleMiddleware(['admin']), getAdminStats);
// GET route to fetch a list of all donors
// Only accessible by authenticated users with 'admin' role
router.get(
  '/donors',
  authMiddleware,
  roleMiddleware(['admin']),
  getAllDonors
);

export default router;
