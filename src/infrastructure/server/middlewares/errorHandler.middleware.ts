import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@/core/apiError/apiError.entity';

import { ApiErrorDatabase } from '@/infrastructure/apiError/apiError.database';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiErrorDatabase = new ApiErrorDatabase();
  const userId = res.locals?.user?.id;
  const userIp =
    req.headers['x-forwarded-for']?.toString() || req.ip.toString();

  console.error(error);
  if (error instanceof ApiError) {
    apiErrorDatabase.create({
      ...error,
      userId,
      userIp,
    });
    res.status(error.statusCode).send({
      status: error.statusCode,
      message: error.message,
      details: error.details,
    });
  } else if (error) {
    apiErrorDatabase.create(
      new ApiError({
        statusCode: 500,
        type: 'server_error',
        message: error.message,
        path: req.path,
        userId,
        userIp,
      })
    );
    res.status(500).send(error);
  } else next();
};
