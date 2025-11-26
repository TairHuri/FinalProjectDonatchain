import { Request, Response } from 'express';
import messageService from "../services/message.service";
import { ServerError } from '../middlewares/error.middleware';

/**
 * Create a new message record in the system.
 * Expects a message body and delegates creation to the messageService.
 */
export const createMessage = async (req: Request, res: Response) => {
    try{
        const {message} = req.body;
        const createdMessage = await messageService.create(message);
        res.status(201).send(createdMessage)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}

/**
 * Get all messages associated with a specific NGO.
 * NGO ID is provided as a route parameter.
 */
export const getMessagesByNgo = async (req: Request, res: Response) => {
    try{
        const {ngoid} = req.params;
        const messages = await messageService.getMessagesByNgo(ngoid);
        res.status(200).send(messages)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}