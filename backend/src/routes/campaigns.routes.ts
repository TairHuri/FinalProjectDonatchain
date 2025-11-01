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
import { toggleCampaignStatus } from '../controllers/campaigns.controller';


const router = Router();

// 📋 רשימת כל הקמפיינים (מנהל בלבד)
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAllCampaigns);

// 📋 רשימת קמפיינים רגילה (ציבורית)
router.get('/', listCampaigns);

// 🔎 קמפיין בודד לפי ID
router.get('/:id', getCampaign);

// ➕ יצירת קמפיין (מאובטח - רק member/manger)
router.post('/', authMiddleware, roleMiddleware(['member', 'manger']), createCampaign);
router.put('/:campaignId', authMiddleware, roleMiddleware(['member', 'manger']), updateCampaign);

export default router;
