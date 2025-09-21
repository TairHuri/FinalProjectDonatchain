import { Router } from 'express';
import { donate } from '../controllers/donations.controller';
import authMiddleware from '../middlewares/auth.middleware';


const router = Router();


router.post('/:id/donate', authMiddleware, donate);


export default router;