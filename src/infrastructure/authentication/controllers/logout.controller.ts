import { Request, Response, NextFunction } from 'express';

import { logoutUsecase } from '@/core/authentication/usecases/logout.usecase';

import { SessionDatabase } from '@/infrastructure/authentication/session.database';

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionId = res.locals.session?.id;

    await logoutUsecase(
      {
        sessionDatabase: new SessionDatabase(),
      },
      {
        sessionId,
      }
    );

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(204).json(null);
  } catch (error) {
    next(error);
  }
};
