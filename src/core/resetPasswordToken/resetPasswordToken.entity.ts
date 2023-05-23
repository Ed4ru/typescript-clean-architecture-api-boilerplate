import { IUserFull } from '@/core/user/user.entity';

export interface IResetPasswordToken {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date;
  token: string;
  userId: IUserFull['id'];
  isValid: boolean;
}

export type IResetPasswordTokenFull = Required<IResetPasswordToken>;
export type IResetPasswordUserToken = Pick<
  IResetPasswordToken,
  'userId' | 'token'
>;

export class ResetPasswordToken {
  id;
  createdAt;
  updatedAt;
  expiresAt;
  token;
  userId;
  isValid;

  constructor(data: IResetPasswordToken) {
    this.id = data.id;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.expiresAt = data.expiresAt;
    this.token = data.token;
    this.userId = data.userId;
    this.isValid = data.isValid;
  }
}
