import { PrismaClient } from '@prisma/client';

import { IApiError, IApiErrorFull } from '@/core/apiError/apiError.entity';
import { ApiErrorRepository } from '@/core/apiError/apiError.repository';

import { prisma } from '@/infrastructure/services/prisma.service';
import { formatPrismaError } from '@/infrastructure/services/formatPrismaError.service';

export class ApiErrorDatabase implements ApiErrorRepository {
  private apiErrorDb: PrismaClient['apiError'];

  constructor() {
    this.apiErrorDb = prisma.apiError;
  }

  async create(data: IApiError): Promise<IApiErrorFull> {
    try {
      const apiError = await this.apiErrorDb.create({
        data,
      });
      return apiError;
    } catch (error) {
      throw formatPrismaError('ApiErrorDatabase.create', error);
    }
  }
}
