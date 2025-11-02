import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import {createMessage, getMessagesByNgo} from '../controllers/message.controller'
const messageRoute = Router();

messageRoute.post('/',authMiddleware, roleMiddleware(['member','manager']), createMessage)
messageRoute.get('/:ngoid',authMiddleware, roleMiddleware(['member','manager']), getMessagesByNgo)
export default messageRoute;