import { User } from '@/core/user/user.entity';
import { CredentialsError } from '@/core/apiError/apiError.entity';
import { ResetPasswordToken } from '@/core/resetPasswordToken/resetPasswordToken.entity';
import { UserRepository } from '@/core/user/user.repository';
import { ResetPasswordTokenRepository } from '@/core/resetPasswordToken/resetPasswordToken.repository';
import { ICryptoService } from '@/core/services/crypto.service.interface';
import { IEmailService } from '@/core/services/email.service.interface';

interface ResetPasswordUsecaseDependencies {
  userDatabase: UserRepository;
  resetPasswordTokenDatabase: ResetPasswordTokenRepository;
  cryptoService: ICryptoService;
  emailService: IEmailService;
}

interface ResetPasswordUsecaseInput {
  email: User['email'];
  clientUri: string;
}

export const resetPasswordUsecase = async (
  {
    userDatabase,
    resetPasswordTokenDatabase,
    cryptoService,
    emailService,
  }: ResetPasswordUsecaseDependencies,
  { email, clientUri }: ResetPasswordUsecaseInput
): Promise<void> => {
  let foundUser;
  try {
    foundUser = await userDatabase.readByEmail(email);
  } catch (error) {
    throw new CredentialsError({
      path: 'resetPasswordUsecase',
      message: 'email_not_found',
      details: `email: ${email}`,
    });
  }

  await resetPasswordTokenDatabase.invalidateAllUserTokens(foundUser.id);
  const token = cryptoService.generateRandomString(32);
  const tokenHash = await cryptoService.hash(token);
  const resetPasswordTokenData = new ResetPasswordToken({
    expiresAt: new Date(Date.now() + 1000 * 60 * 5), // 5m
    userId: foundUser.id,
    token: tokenHash,
    isValid: true,
  });
  await resetPasswordTokenDatabase.create(resetPasswordTokenData);

  const setNewPasswordUrl = `${clientUri}/set-password?id=${foundUser.id}&token=${token}`;
  const emailData = {
    email: foundUser.email,
    subject: 'API Boilerplate - Password Reset',
    text: `Hello,

    Please click on the link below to reset your password : ${setNewPasswordUrl}`,
    html: `<h1>Hello</h1>
    <p>Please click on the link below to reset your password :</p>
    <p><a href="${setNewPasswordUrl}">Reset my password</a></p>`,
  };

  emailService.sendEmail(emailData);
};
