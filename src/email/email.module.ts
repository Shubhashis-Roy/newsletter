import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAILGUN_HOST,
        port: Number(process.env.MAILGUN_PORT),
        auth: {
          user: process.env.MAILGUN_USER,
          pass: process.env.MAILGUN_PASS,
        },
      },
      defaults: {
        from: process.env.MAILGUN_FROM,
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
