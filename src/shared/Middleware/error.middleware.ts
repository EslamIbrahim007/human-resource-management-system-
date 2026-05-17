import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/apiError.js';
import logger from '../utils/logger.js';
import { env } from '../../config/env.js';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = `Validation Error: ${err.message}`;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID format`;
  } else if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered';
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
    user: (req as any).user?.id
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.nodeEnv === 'development' && { stack: err.stack, error: err })
  });
};