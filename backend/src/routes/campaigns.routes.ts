import { Router } from 'express';
import { createCampaign, updateCampaign, listCampaigns, getCampaign, getCampagnsByNgo } from '../controllers/campaigns.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';

const router = Router();

// 📋 רשימת כל הקמפיינים
router.get('/', listCampaigns);

// 🔎 קמפיין בודד לפי ID
router.get('/:id', getCampaign);

// ➕ יצירת קמפיין (מאובטח - רק NGO/Admin)
router.post('/', authMiddleware, roleMiddleware(['member', 'admin']), createCampaign);
router.put('/:campaignId', authMiddleware, roleMiddleware(['member', 'admin']), updateCampaign);

export default router;
