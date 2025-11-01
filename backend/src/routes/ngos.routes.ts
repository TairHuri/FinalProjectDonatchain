// src/routes/ngos.routes.ts
import { Router } from 'express';
import { createNgo, listNgos, getNgo, updateNgo } from '../controllers/ngos.controller';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import { validateCreateNgo } from '../utils/validators';

const router = Router();

router.get('/', listNgos);
router.get('/:id', getNgo);

// יצירה ועדכון — רק member או manger
router.post('/', authMiddleware, roleMiddleware(['member','manger']), validateCreateNgo, createNgo);
router.put('/:id', authMiddleware, roleMiddleware(['member','manger']), updateNgo);

export default router;
