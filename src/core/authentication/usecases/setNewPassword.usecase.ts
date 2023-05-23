import { IUserFull } from '@/core/user/user.entity';
import { CredentialsError } from '@/core/apiError/apiError.entity';
import {
  IResetPasswordTokenFull,
  ResetPasswordToken,
} from '@/core/resetPasswordToken/resetPasswordToken.entity';
import { UserRepository } from '@/core/user/user.repository';
import { ResetPasswordTokenRepository } from '@/core/resetPasswordToken/resetPasswordToken.repository';
import { ICryptoService } from '@/core/services/crypto.service.interface';

interface SetNewPasswordUsecaseDependencies {
  userDatabase: UserRepository;
  resetPasswordTokenDatabase: ResetPasswordTokenRepository;
  cryptoService: ICryptoService;
}

interface SetNewPasswordUsecaseInput {
  token: ResetPasswordToken['token'];
  userId: IUserFull['id'];
  password: string;
}

export const setNewPasswordUsecase = async (
  {
    userDatabase,
    resetPasswordTokenDatabase,
    cryptoService,
  }: SetNewPasswordUsecaseDependencies,
  { token, userId, password }: SetNewPasswordUsecaseInput
): Promise<void> => {
  let foundToken: IResetPasswordTokenFull;
  try {
    foundToken = await resetPasswordTokenDatabase.findValidTokenByUserId(
      userId
    );
  } catch (error) {
    throw new CredentialsError({
      path: 'setNewPasswordUsecase',
      message: 'invalid_token',
      details: `token: ${token}`,
    });
  }

  const tokenMatch = await cryptoService.compare(token, foundToken?.token);
  if (!tokenMatch) {
    throw new CredentialsError({
      path: 'setNewPasswordUsecase',
      message: 'invalid_token',
      details: `token: ${token}`,
    });
  }

  resetPasswordTokenDatabase.invalidateAllUserTokens(userId);

  const passwordHash = await cryptoService.hash(password);

  await userDatabase.update(userId, { password: passwordHash });
};
