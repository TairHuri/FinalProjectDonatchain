import { Router } from 'express';
import authRoutes from './auth.routes';
import campaignsRoutes from './campaigns.routes';
import donationsRoutes from './donations.routes';


const router = Router();


router.use('/auth', authRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/donations', donationsRoutes);


router.get('/', (req, res) => res.json({ ok: true }));


export default router;