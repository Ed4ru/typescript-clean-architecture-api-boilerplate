import { Request, Response, NextFunction } from 'express';

import { registerUsecase } from '@/core/authentication/usecases/register.usecase';

import { RegisterInput } from '@/infrastructure/authentication/schemas/register.schema';
import { UserDatabase } from '@/infrastructure/user/user.database';
import { CryptoService } from '@/infrastructure/services/crypto.service';

export const registerController = async (
  req: Request<{}, {}, RegisterInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstname, lastname, nickname, email, password } = req.body;

    const { registeredUser } = await registerUsecase(
      { userDatabase: new UserDatabase(), cryptoService: new CryptoService() },
      { firstname, lastname, nickname, email, password }
    );

    res.status(201).json({ user: registeredUser });
  } catch (error) {
    next(error);
  }
};
