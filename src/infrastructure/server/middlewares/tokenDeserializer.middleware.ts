import { Request, Response, NextFunction } from 'express';

import { AccessToken } from '@/core/services/token.service.interface';

import { TokenService } from '@/infrastructure/services/token.service';

export const tokenDeserializer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken && !refreshToken) return next();

  const tokenService = new TokenService();
  try {
    const accessTokenData = tokenService.verify<AccessToken>(accessToken);
    res.locals.user = accessTokenData.user;
    res.locals.session = accessTokenData.session;
    return next();
  } catch (error) {
    //
  }

  try {
    const newAccessToken = await tokenService.reIssueAccessToken(refreshToken);
    res.cookie('accessToken', newAccessToken, {
      maxAge: 900000, // 15 minutes
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    const { user, session } = tokenService.verify<AccessToken>(newAccessToken);
    res.locals.user = user;
    res.locals.session = session;
  } catch {
    //
  }

  return next();
};
