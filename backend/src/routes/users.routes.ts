// src/routes/users.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { getMe, updateMe, listUsers } from '../controllers/users.controller';
import roleMiddleware from '../middlewares/role.middleware';
import { validateUpdateProfile } from '../utils/validators';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, validateUpdateProfile, updateMe);

// Admin-only: list users
router.get('/', authMiddleware, roleMiddleware(['admin']), listUsers);

export default router;
