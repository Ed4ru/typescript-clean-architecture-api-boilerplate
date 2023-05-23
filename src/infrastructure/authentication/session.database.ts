import { PrismaClient } from '@prisma/client';

import { SessionRepository } from '@/core/authentication/session.repository';
import { ISessionIds, Session } from '@/core/authentication/session.entity';
import { ISessionFull } from '@/core/authentication/session.entity';

import { prisma } from '@/infrastructure/services/prisma.service';
import { formatPrismaError } from '@/infrastructure/services/formatPrismaError.service';

export class SessionDatabase implements SessionRepository {
  private sessionDb: PrismaClient['session'];

  constructor() {
    this.sessionDb = prisma.session;
  }

  async create({ active, userAgent, userId }: Session): Promise<ISessionFull> {
    try {
      const session = await this.sessionDb.create({
        data: {
          active,
          userAgent,
          user: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          active: true,
          userAgent: true,
          userId: true,
        },
      });
      return session;
    } catch (error) {
      throw formatPrismaError('SessionDatabase.create', error);
    }
  }

  async readById(id: ISessionFull['id']): Promise<ISessionFull> {
    try {
      const session = await this.sessionDb.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          active: true,
          userAgent: true,
          userId: true,
        },
      });
      return session;
    } catch (error) {
      throw formatPrismaError('SessionDatabase.readById', error);
    }
  }

  async revokeAllExceptOne({ id, userId }: ISessionIds): Promise<void> {
    try {
      await this.sessionDb.updateMany({
        where: {
          userId,
          active: true,
          NOT: {
            id,
          },
        },
        data: {
          active: false,
        },
      });
      return;
    } catch (error) {
      throw formatPrismaError('SessionDatabase.revokeAllExceptOne', error);
    }
  }

  async update(
    id: ISessionFull['id'],
    data: Partial<Session>
  ): Promise<ISessionFull> {
    try {
      const session = await this.sessionDb.update({
        where: { id },
        data,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          active: true,
          userAgent: true,
          userId: true,
        },
      });
      return session;
    } catch (error) {
      throw formatPrismaError('SessionDatabase.update', error);
    }
  }
}
