import { Request, Response, NextFunction } from 'express';

import { retrieveSessionUsecase } from '@/core/authentication/usecases/retrieveSession.usecase';

import { UserDatabase } from '@/infrastructure/user/user.database';
import { SessionDatabase } from '@/infrastructure/authentication/session.database';

export const retrieveSessionController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals?.user?.id;
    const sessionId = res.locals?.session?.id;

    const { user, session } = await retrieveSessionUsecase(
      {
        userDatabase: new UserDatabase(),
        sessionDatabase: new SessionDatabase(),
      },
      { userId, sessionId }
    );

    return res.status(200).json({ user, session });
  } catch (error) {
    next(error);
  }
};
