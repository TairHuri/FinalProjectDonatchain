import { Router } from 'express';
import {
  cryptoDonate,
  creditDonate,
  getDonationsByCampaign,
  getFullDonationsByCampaign,
  getDonationsByNgo,
  getAllDonations, 
} from "../controllers/donations.controller";


const router = Router();


router.post('/:id/donate', cryptoDonate);
router.post('/:id/credit-donate', creditDonate);
router.get('/campaign', getDonationsByCampaign);
router.get('/campaign/ngomember', getFullDonationsByCampaign);
router.get('/ngo', getDonationsByNgo);
router.get("/", getAllDonations);

export default router;