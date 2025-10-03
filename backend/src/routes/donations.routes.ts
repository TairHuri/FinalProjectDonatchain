import { Router } from 'express';
import { donate, creditDonate } from '../controllers/donations.controller';
import authMiddleware from '../middlewares/auth.middleware';


const router = Router();


router.post('/:id/donate', authMiddleware, donate);
router.post('/:id/credit-donate', creditDonate);


export default router;