// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import {config} from '../config'

export class ServerError extends Error{
  statusCode:number;
  constructor(message:string, statusCode:number){
    super(message)
    this.statusCode=statusCode;
  }
}
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  // Normalize error
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log stack in development
  logger.error(`${req.method} ${req.originalUrl} → ${status} : ${message}`);
  if (config.nodeEnv !== 'production') {
    logger.error(err.stack);
  }

  res.status(status).json({
    success: false,
    message,
    ...(config.nodeEnv !== 'production' ? { stack: err.stack } : {})
  });
};
