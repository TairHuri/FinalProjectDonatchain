import { Router } from 'express';
import {
  createCampaign,
  updateCampaign,
  listCampaigns,
  getCampaign,
  getAllCampaigns
} from '../controllers/campaigns.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';

const router = Router();

// 📋 רשימת כל הקמפיינים (מנהל בלבד)
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAllCampaigns);

// 📋 רשימת קמפיינים רגילה (ציבורית)
router.get('/', listCampaigns);

// 🔎 קמפיין בודד לפי ID
router.get('/:id', getCampaign);

// ➕ יצירת קמפיין (מאובטח - רק NGO/Admin)
router.post('/', authMiddleware, roleMiddleware(['ngo', 'admin']), createCampaign);

// ✏️ עדכון קמפיין קיים
router.put('/:campaignId', authMiddleware, roleMiddleware(['ngo', 'admin']), updateCampaign);

export default router;
