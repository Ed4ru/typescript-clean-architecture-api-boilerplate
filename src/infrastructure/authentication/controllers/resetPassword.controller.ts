import { Request, Response, NextFunction } from 'express';
import config from 'config';

import { resetPasswordUsecase } from '@/core/authentication/usecases/resetPassword.usecase';

import { ResetPasswordInput } from '@/infrastructure/authentication/schemas/resetPassword.schema';
import { UserDatabase } from '@/infrastructure/user/user.database';
import { ResetPasswordTokenDatabase } from '@/infrastructure/resetPasswordToken/resetPasswordToken.database';
import { CryptoService } from '@/infrastructure/services/crypto.service';
import { EmailService } from '@/infrastructure/services/email.service';

export const resetPasswordController = async (
  req: Request<{}, {}, ResetPasswordInput['body']>,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const clientUri = config.get<string>('clientUri');

  try {
    await resetPasswordUsecase(
      {
        userDatabase: new UserDatabase(),
        resetPasswordTokenDatabase: new ResetPasswordTokenDatabase(),
        cryptoService: new CryptoService(),
        emailService: new EmailService(),
      },
      { email, clientUri }
    );

    res.status(200).json({
      message: 'reset_password_email_sent',
    });
  } catch (error) {
    next(error);
  }
};
