import {
  IResetPasswordToken,
  IResetPasswordTokenFull,
  ResetPasswordToken,
} from '@/core/resetPasswordToken/resetPasswordToken.entity';

export interface ResetPasswordTokenRepository {
  create(data: IResetPasswordToken): Promise<IResetPasswordTokenFull>;
  findValidTokenByUserId(
    userId: IResetPasswordTokenFull['userId']
  ): Promise<IResetPasswordTokenFull>;
  invalidateToken(
    id: IResetPasswordTokenFull['id']
  ): Promise<IResetPasswordTokenFull>;
  invalidateAllUserTokens(userId: ResetPasswordToken['userId']): Promise<void>;
}
