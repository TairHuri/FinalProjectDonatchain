import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import roleMiddleware from '../middlewares/role.middleware';
import * as controller from '../controllers/request.controller';

const requestsRoutes = Router();

requestsRoutes.post('/',authMiddleware, roleMiddleware(['manager']), controller.createdRequest)
requestsRoutes.put('/:requestId',authMiddleware, roleMiddleware(['manager','admin']), controller.updateRequest)
requestsRoutes.get('/templates',authMiddleware, roleMiddleware(['manager']), controller.getTemplates)
requestsRoutes.get('/:ngoid',authMiddleware, roleMiddleware(['manager']), controller.getRequestsByNgo)
requestsRoutes.get('/',authMiddleware, roleMiddleware(['admin']), controller.getRequests)
export default requestsRoutes;