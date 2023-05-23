import { Request, Response, NextFunction } from 'express';

import { setNewPasswordUsecase } from '@/core/authentication/usecases/setNewPassword.usecase';

import { SetNewPasswordInput } from '@/infrastructure/authentication/schemas/setNewPassword.schema';
import { UserDatabase } from '@/infrastructure/user/user.database';
import { ResetPasswordTokenDatabase } from '@/infrastructure/resetPasswordToken/resetPasswordToken.database';
import { CryptoService } from '@/infrastructure/services/crypto.service';

export const setNewPasswordController = async (
  req: Request<SetNewPasswordInput['params'], {}, SetNewPasswordInput['body']>,
  res: Response,
  next: NextFunction
) => {
  const { userId, token } = req.params;
  const { password } = req.body;

  try {
    await setNewPasswordUsecase(
      {
        userDatabase: new UserDatabase(),
        resetPasswordTokenDatabase: new ResetPasswordTokenDatabase(),
        cryptoService: new CryptoService(),
      },
      {
        userId,
        token,
        password,
      }
    );

    res.status(200).json({
      message: 'new_password_set_successfully',
    });
  } catch (error) {
    next(error);
  }
};
