// src/routes/users.routes.ts
import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { getMe, updateMe, listUsers, listUsersByNgo, approveUser, deleteUse ,changeUserRole, changePassword } from '../controllers/users.controller';
import roleMiddleware from '../middlewares/role.middleware';
import { validateUpdateProfile } from '../utils/validators';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, validateUpdateProfile, updateMe);
router.patch('/me', authMiddleware, changePassword);

router.get('/', authMiddleware, roleMiddleware(['admin']), listUsers);
router.get('/ngo/:ngoId', authMiddleware, listUsersByNgo);
router.patch('/approve/:userId', approveUser)
router.patch('/role/:userId', changeUserRole)
router.delete('/:userId', deleteUse)

export default router;
