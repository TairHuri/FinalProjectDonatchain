import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import {createMessage, getMessagesByNgo} from '../controllers/message.controller'
const messageRoute = Router();

messageRoute.post('/',authMiddleware, roleMiddleware(['member','manger']), createMessage)
messageRoute.get('/:ngoid',authMiddleware, roleMiddleware(['member','manger']), getMessagesByNgo)
export default messageRoute;