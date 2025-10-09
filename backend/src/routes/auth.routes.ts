import { Router } from 'express';
import { login, me, registerNewNgo, registerExistingNgo } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';


const router = Router();
router.post('/register/newngo', registerNewNgo);
router.post('/register/existingngo', registerExistingNgo);
router.post('/login', login);
router.get('/me', authMiddleware, me);


export default router;