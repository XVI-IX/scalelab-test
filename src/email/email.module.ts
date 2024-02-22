import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import config from 'src/config/environment/env.config';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: config.EMAIL_HOST,
        port: Number(config.EMAIL_PORT),
        secure: false,
        auth: {
          user: config.EMAIL_USER,
          pass: config.EMAIL_PASS,
        },
      },
      defaults: {
        from: '"From FoodOrder" <>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    BullModule.registerQueue({
      name: 'mailing',
    }),
  ],
})
export class EmailModule {}
