import { Router } from 'express';
import { donate, creditDonate, getDonationsByCampaign, getDonationsByNgo } from '../controllers/donations.controller';
import authMiddleware from '../middlewares/auth.middleware';


const router = Router();


router.post('/:id/donate', donate);
router.post('/:id/credit-donate', creditDonate);
router.get('/campaign', getDonationsByCampaign);
router.get('/ngo', getDonationsByNgo);

export default router;