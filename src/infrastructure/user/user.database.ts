import { PrismaClient } from '@prisma/client';

import {
  IUserFull,
  IUserFullPayload,
  IUserFullWithoutSessions,
  IUser,
  User,
} from '@/core/user/user.entity';
import { UserRepository } from '@/core/user/user.repository';

import { prisma } from '@/infrastructure/services/prisma.service';
import { formatPrismaError } from '@/infrastructure/services/formatPrismaError.service';

export class UserDatabase implements UserRepository {
  private userDb: PrismaClient['user'];

  constructor() {
    this.userDb = prisma.user;
  }

  async create(data: IUser): Promise<IUserFullPayload> {
    try {
      const user = await this.userDb.create({
        data,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          firstname: true,
          lastname: true,
          nickname: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw formatPrismaError('UserDatabase.create', error);
    }
  }

  async readByEmail(
    email: IUserFull['email']
  ): Promise<IUserFullWithoutSessions> {
    try {
      const user = await this.userDb.findUniqueOrThrow({
        where: { email },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          firstname: true,
          lastname: true,
          nickname: true,
          email: true,
          password: true,
        },
      });
      return user;
    } catch (error) {
      throw formatPrismaError('UserDatabase.readByEmail', error);
    }
  }

  async readById(id: IUserFull['id']): Promise<IUserFullWithoutSessions> {
    try {
      const user = await this.userDb.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          firstname: true,
          lastname: true,
          nickname: true,
          email: true,
          password: true,
        },
      });
      return user;
    } catch (error) {
      throw formatPrismaError('UserDatabase.readById', error);
    }
  }

  async update(
    id: IUserFull['id'],
    data: Partial<User>
  ): Promise<IUserFullPayload> {
    try {
      const user = await this.userDb.update({
        where: { id },
        data,
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          firstname: true,
          lastname: true,
          nickname: true,
          email: true,
        },
      });
      return user;
    } catch (error) {
      throw formatPrismaError('UserDatabase.update', error);
    }
  }
}
