import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailData } from './email.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('mailing')
export class EmailProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('admin.register')
  async sendWelcomeEmailAdmin(job: Job<EmailData>) {
    const { data } = job;

    const { username, url } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: `Admin account created`,
      template: './welcome',
      context: {
        username: username,
        url: url,
      },
    });
  }

  @Process('admin.verify')
  async sendVerifyEmailAdmin(job: Job<EmailData>) {
    const { data } = job;

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

  @Process('vendors.forgot-password')
  async sendVendorFGEmail(job: Job<EmailData>) {
    const { data } = job;

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
