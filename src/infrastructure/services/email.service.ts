import config from 'config';
import nodemailer, { Transporter } from 'nodemailer';

import {
  IEmailService,
  SendResetPasswordEmailInput,
} from '@/core/services/email.service.interface';
import { ServerError } from '@/core/apiError/apiError.entity';

import { ApiErrorDatabase } from '@/infrastructure/apiError/apiError.database';

const emailService = config.get<string>('emailService');
const emailUser = config.get<string>('emailUser');
const emailClientId = config.get<string>('emailClientId');
const emailClientSecret = config.get<string>('emailClientSecret');
const emailRefreshToken = config.get<string>('emailRefreshToken');

export class EmailService implements IEmailService {
  private transporter: Transporter;
  private apiErrorDb: ApiErrorDatabase;

  constructor() {
    this.apiErrorDb = new ApiErrorDatabase();
    this.transporter = nodemailer.createTransport({
      service: emailService,
      auth: {
        type: 'OAuth2',
        user: emailUser,
        clientId: emailClientId,
        clientSecret: emailClientSecret,
        refreshToken: emailRefreshToken,
      },
    });
  }

  async sendEmail({
    email,
    subject,
    text,
    html,
  }: SendResetPasswordEmailInput): Promise<void> {
    try {
      let emailOptions = {
        from: emailUser,
        to: email,
        subject,
        text,
        html,
      };
      await this.transporter.sendMail(emailOptions);
    } catch (error) {
      console.error(error);
      const sendEmailError = new ServerError({
        path: 'EmailService.sendEmail',
        message: 'email_service_failure',
        raw: String(error),
      });
      this.apiErrorDb.create(sendEmailError);
    }
  }
}
