import { Request, Response, NextFunction } from 'express';

import { loginUsecase } from '@/core/authentication/usecases/login.usecase';

import { LoginInput } from '@/infrastructure/authentication/schemas/login.schema';
import { UserDatabase } from '@/infrastructure/user/user.database';
import { SessionDatabase } from '@/infrastructure/authentication/session.database';
import { TokenService } from '@/infrastructure/services/token.service';
import { CryptoService } from '@/infrastructure/services/crypto.service';

export const loginController = async (
  req: Request<{}, {}, LoginInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const userAgent = req.headers['user-agent'] || null;

    const { user, session, accessToken, refreshToken } = await loginUsecase(
      {
        userDatabase: new UserDatabase(),
        sessionDatabase: new SessionDatabase(),
        cryptoService: new CryptoService(),
        tokenService: new TokenService(),
      },
      {
        email,
        password,
        userAgent,
      }
    );

    res.cookie('accessToken', accessToken, {
      maxAge: 1000 * 60 * 15, // 15 minutes
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.cookie('refreshToken', refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    res.status(201).json({
      user,
      session,
    });
  } catch (error) {
    next(error);
  }
};
