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
// This file defines donation-related routes.
// It handles cryptocurrency and credit donations, 
// as well as fetching donation data by campaign or NGO.
// These routes allow both creating donations and retrieving donation reports.
router.post('/:id/donate', cryptoDonate);
router.post('/:id/credit-donate', creditDonate);
router.get('/campaign', getDonationsByCampaign);
router.get('/campaign/ngomember', getFullDonationsByCampaign);
router.get('/ngo', getDonationsByNgo);
router.get("/", getAllDonations);

export default router;