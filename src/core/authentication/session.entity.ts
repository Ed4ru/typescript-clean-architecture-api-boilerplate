import { IUserFull } from '@/core/user/user.entity';

export interface ISession {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  active: boolean;
  userAgent: string | null;
  userId: IUserFull['id'];
}

export type ISessionFull = Required<ISession>;
export type ISessionIds = Pick<ISessionFull, 'id' | 'userId'>;

export class Session {
  id;
  createdAt;
  updatedAt;
  active;
  userAgent;
  userId;

  constructor(data: ISession) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.active = data.active;
    this.userAgent = data.userAgent;
    this.userId = data.userId;
  }
}
