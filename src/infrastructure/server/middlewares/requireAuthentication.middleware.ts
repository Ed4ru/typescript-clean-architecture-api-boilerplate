import { Request, Response, NextFunction } from 'express';

export const requireAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!res.locals?.user && !res.locals?.session) return res.sendStatus(403);
  return next();
};
