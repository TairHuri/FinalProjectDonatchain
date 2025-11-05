import { Router } from 'express';
import {
  createCampaign,
  updateCampaign,
  listCampaigns,
  getCampaign,
  getAllCampaigns,
  getCampaignTags
} from '../controllers/campaigns.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { toggleCampaignStatus } from '../controllers/campaigns.controller';


const router = Router();

router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), getAllCampaigns);

router.get('/', listCampaigns);
router.get('/tags', getCampaignTags);


router.get('/:id', getCampaign);

router.post('/', authMiddleware, roleMiddleware(['member', 'manager']), createCampaign);
router.put('/:campaignId', authMiddleware, roleMiddleware(['member', 'manager']), updateCampaign);
router.put('/:id/toggle-status', authMiddleware, roleMiddleware(['admin', 'manager']), toggleCampaignStatus);

export default router;
