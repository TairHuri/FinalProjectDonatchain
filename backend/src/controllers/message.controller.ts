import { Request, Response } from 'express';
import messageService from "../services/message.service";
import { ServerError } from '../middlewares/error.middleware';

export const createMessage = async (req: Request, res: Response) => {
    try{
        const {message} = req.body;
        const createdMessage = await messageService.create(message);
        res.status(201).send(createdMessage)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}

export const getMessagesByNgo = async (req: Request, res: Response) => {
    try{
        const {ngoid} = req.params;
        const messages = await messageService.getMessagesByNgo(ngoid);
        res.status(200).send(messages)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}