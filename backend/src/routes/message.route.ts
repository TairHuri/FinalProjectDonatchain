import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import {createMessage, getMessagesByNgo} from '../controllers/message.controller'
const messageRoute = Router();
// Routes for handling messages related to NGOs.
// - POST "/" allows authenticated members or managers to create a new message.
// - GET "/:ngoid" allows authenticated members or managers to fetch messages for a specific NGO.
messageRoute.post('/',authMiddleware, roleMiddleware(['member','manager']), createMessage)
messageRoute.get('/:ngoid',authMiddleware, roleMiddleware(['member','manager']), getMessagesByNgo)
export default messageRoute;