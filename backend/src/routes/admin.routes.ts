// src/routes/admin.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { getStats } from '../controllers/admin.controller';

const router = Router();

// רק admin יכול לקרוא
router.get('/stats', authMiddleware, roleMiddleware(['admin']), getStats);

export default router;
