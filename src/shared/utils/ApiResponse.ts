import { Response } from 'express';

interface ApiResponseOptions<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendResponse = <T>(res: Response, options: ApiResponseOptions<T>) => {
  const { statusCode = 200, message = 'Success', data, meta } = options;

  const response: any = {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta })
  };

  res.status(statusCode).json(response);
};