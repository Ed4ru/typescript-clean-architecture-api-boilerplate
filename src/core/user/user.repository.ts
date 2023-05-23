import {
  IUser,
  IUserFull,
  IUserFullWithoutSessions,
  IUserFullPayload,
} from '@/core/user/user.entity';

export interface UserRepository {
  create(data: IUser): Promise<IUserFullPayload>;
  readByEmail(email: IUserFull['email']): Promise<IUserFullWithoutSessions>;
  readById(id: IUserFull['id']): Promise<IUserFullWithoutSessions>;
  update(id: IUserFull['id'], data: Partial<IUser>): Promise<IUserFullPayload>;
}
