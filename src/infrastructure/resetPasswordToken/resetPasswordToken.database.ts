import { PrismaClient } from '@prisma/client';

import {
  IResetPasswordToken,
  IResetPasswordTokenFull,
} from '@/core/resetPasswordToken/resetPasswordToken.entity';
import { ResetPasswordTokenRepository } from '@/core/resetPasswordToken/resetPasswordToken.repository';

import { prisma } from '@/infrastructure/services/prisma.service';
import { formatPrismaError } from '@/infrastructure/services/formatPrismaError.service';

export class ResetPasswordTokenDatabase
  implements ResetPasswordTokenRepository
{
  private resetPasswordTokenDb: PrismaClient['resetPasswordToken'];

  constructor() {
    this.resetPasswordTokenDb = prisma.resetPasswordToken;
  }

  async create(data: IResetPasswordToken): Promise<IResetPasswordTokenFull> {
    try {
      const resetPasswordToken = await this.resetPasswordTokenDb.create({
        data,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          expiresAt: true,
          token: true,
          userId: true,
          isValid: true,
        },
      });
      return resetPasswordToken;
    } catch (error) {
      throw formatPrismaError('ResetPasswordTokenDatabase.create', error);
    }
  }

  async findValidTokenByUserId(
    userId: IResetPasswordTokenFull['userId']
  ): Promise<IResetPasswordTokenFull> {
    try {
      const foundToken = await this.resetPasswordTokenDb.findFirstOrThrow({
        where: {
          userId,
          isValid: true,
          expiresAt: {
            gte: new Date(),
          },
        },
      });
      return foundToken;
    } catch (error) {
      throw formatPrismaError(
        'ResetPasswordTokenDatabase.findValidTokenByUserId',
        error
      );
    }
  }

  async invalidateToken(
    id: IResetPasswordTokenFull['id']
  ): Promise<IResetPasswordTokenFull> {
    try {
      const updatedToken = await this.resetPasswordTokenDb.update({
        where: { id },
        data: { isValid: false },
      });
      return updatedToken;
    } catch (error) {
      throw formatPrismaError(
        'ResetPasswordTokenDatabase.invalidateToken',
        error
      );
    }
  }

  async invalidateAllUserTokens(
    userId: IResetPasswordToken['userId']
  ): Promise<void> {
    try {
      await this.resetPasswordTokenDb.updateMany({
        where: { userId },
        data: { isValid: false },
      });
    } catch (error) {
      throw formatPrismaError(
        'ResetPasswordTokenDatabase.invalidateAllUserTokens',
        error
      );
    }
  }
}
