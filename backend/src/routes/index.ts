import { Router } from 'express';
import authRoutes from './auth.routes';
import campaignsRoutes from './campaigns.routes';
import donationsRoutes from './donations.routes';
import ngoRoutes from './ngos.routes';
import usersRoutes from './users.routes';
import adminRoutes from './admin.routes';

const router = Router();


router.use('/auth', authRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/donations', donationsRoutes);
router.use('/ngos', ngoRoutes);
router.use('/users', usersRoutes);
router.use('/admin', adminRoutes);

router.get('/', (req, res) => res.json({ ok: true }));


export default router;