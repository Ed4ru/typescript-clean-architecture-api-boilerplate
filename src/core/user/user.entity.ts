import { ISession } from '@/core/authentication/session.entity';

export interface IUser {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstname: string;
  lastname: string;
  nickname: string;
  email: string;
  password: string;
  sessions?: ISession[];
}

export type IUserFull = Required<IUser>;
export type IUserWithoutPassword = Omit<IUser, 'password'>;
export type IUserFullWithoutPassword = Omit<IUserFull, 'password'>;
export type IUserFullWithoutSessions = Omit<IUserFull, 'sessions'>;
export type IUserFullPayload = Omit<IUserFull, 'password' | 'sessions'>;

export class User {
  id;
  createdAt;
  updatedAt;
  firstname;
  lastname;
  nickname;
  email;
  password;
  sessions;

  constructor(data: IUser) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.nickname = data.nickname;
    this.email = data.email;
    this.password = data.password;
    this.sessions = data.sessions;
  }
}
