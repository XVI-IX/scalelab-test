import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailData } from './email.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Processor('mailing')
export class EmailProcessor {
  constructor(
    private mailerService: MailerService,
    private eventEmitter: EventEmitter2,
  ) {}

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

  @Process('order.confirmed')
  async sendOrderConfirmEmail(job: Job<EmailData>) {
    const { data } = job;
    const { username } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Order Confirmed',
      template: './order-confirmed',
      context: {
        username,
      },
    });
  }

  @Process('order.delivered')
  async sendOrderDeliveredEmail(job: Job<EmailData>) {
    const { data } = job;
    const { username } = data.data;

    await this.mailerService.sendMail({
      to: data.to,
      subject: 'Order Delivered',
      template: './order-delivered',
      context: {
        username,
      },
    });
  }

  @Process('admin.messageAll')
  async sendAdminMailAll(job: Job<EmailData>) {
    const { data } = job;
    const { emails, subject, content } = data.data;

    try {
      const mailerPromises = emails.map((email) => {
        this.mailerService.sendMail({
          to: email,
          subject: subject,
          template: content || './admin-message',
        });
      });
      const responses = await Promise.all(mailerPromises);

      this.eventEmitter.emit('admin.allMessagesSent');

      console.log('All Mails have been sent ', responses);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
