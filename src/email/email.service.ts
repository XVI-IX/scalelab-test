import { Injectable } from '@nestjs/common';
import { EmailData } from './email.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
  constructor(@InjectQueue('mailing') private mailingQueue: Queue) {}

  @OnEvent('admin.register')
  async welcomeAdminEmail(data: EmailData) {
    const job = await this.mailingQueue.add('admin.register', { data });

    return { jobId: job.id };
  }

  @OnEvent('admin.verify')
  async verifyAdminEmail(data: EmailData) {
    const job = await this.mailingQueue.add('admin.verify', { data });
    return { jobId: job.id };
  }

  @OnEvent('vendors.forgot-password')
  async forgotPasswordVendor(data: EmailData) {
    const job = await this.mailingQueue.add('vendors.forgot-password', {
      data,
    });
    return { jobId: job.id };
  }
}
