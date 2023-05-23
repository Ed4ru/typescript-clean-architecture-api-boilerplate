import { IUserFull } from '@/core/user/user.entity';

export interface SendResetPasswordEmailInput {
  email: IUserFull['email'];
  subject: string;
  text: string;
  html: string;
}

export interface IEmailService {
  sendEmail(data: SendResetPasswordEmailInput): Promise<void>;
}
