import { Router } from 'express';
import { createCampaign, listCampaigns, getCampaign } from '../controllers/campaigns.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';

const router = Router();

// 📋 רשימת כל הקמפיינים
router.get('/', listCampaigns);

// 🔎 קמפיין בודד לפי ID
router.get('/:id', getCampaign);

// ➕ יצירת קמפיין (מאובטח - רק NGO/Admin)
router.post('/', authMiddleware, roleMiddleware(['ngo', 'admin']), createCampaign);

export default router;
