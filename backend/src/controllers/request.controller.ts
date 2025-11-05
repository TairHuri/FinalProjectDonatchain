import { Request, Response } from 'express';
import requestService from "../services/requests.service";
import { ServerError } from '../middlewares/error.middleware';
import templates from  '../config/requestTemplates.json'

export const createdRequest = async (req: Request, res: Response) => {
    try{
        const {request} = req.body;
        const createdRequest = await requestService.create(request)
        res.status(201).send(createdRequest)
    }catch(error){
        console.log(error);
        
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}
export const updateRequest = async (req: Request, res: Response) => {
    try{
        const {requestId} = req.params;
        const {request} = req.body;
        const createdRequest = await requestService.update(requestId, request)
        res.status(201).send(createdRequest)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}

export const getRequestsByNgo = async (req: Request, res: Response) => {
    try{
        const {ngoid} = req.params;
        const {includeDone} = req.query;
        const p:boolean = includeDone && includeDone.toString() == 'true' || false;
        const requests = await requestService.getRequestsByNgo(ngoid, p)
        res.status(200).send(requests)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}
export const getRequests = async (req: Request, res: Response) => {
    try{
        const {includeDone} = req.query;
        const p:boolean = includeDone && includeDone.toString() == 'true' || false;
        const requests = await requestService.getRequests( p)
        res.status(200).send(requests)
    }catch(error){
        res.status((error as ServerError).statusCode||500).send({ message: (error as any).message });
    }
}

export const getTemplates = (req: Request, res: Response) =>{
    res.send(templates)
}