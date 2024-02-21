import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailData } from './email.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  @OnEvent('admin.register')
  async welcomeAdminEmail(data: EmailData) {
    const { username, url } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: `Admin account created`,
      template: './welcome',
      context: {
        username,
        url,
      },
    });
  }

  @OnEvent('admin.verify')
  async verifyAdminEmail(data: EmailData) {
    const { username } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: `Admin account verified`,
      template: './verify-admin',
      context: {
        username,
      },
    });
  }

  @OnEvent('vendors.forgot-password')
  async forgotPasswordVendor(data: EmailData) {
    const { username, url } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Forgot Password',
      template: './vendor-forgot-password',
      context: {
        username,
        url,
      },
    });
  }
}
