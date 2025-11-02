import { Router } from 'express';
import { login, me, registerNewNgo, registerExistingNgo } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import {
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();
router.post('/register/newngo', registerNewNgo);
router.post('/register/existingngo', registerExistingNgo);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);
export default router;