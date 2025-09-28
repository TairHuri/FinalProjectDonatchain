import { Router } from 'express';
import { createCampaign, listCampaigns, getCampaign } from '../controllers/campaigns.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';

const router = Router();

router.get('/', listCampaigns); // ← GET /api/campaigns?ngoId=...
router.get('/:id', getCampaign);
router.post('/', authMiddleware, roleMiddleware(['ngo', 'admin']), createCampaign);

export default router;
