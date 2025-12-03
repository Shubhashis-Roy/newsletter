import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  
  @Post('send')
  async sendEmail(@Body() body: { to: string; subject: string; text: string },) {
    const { to, subject, text } = body;
    await this.emailService.sendEmail(to, subject, text);
    return { message: `Email sent successfully to ${to}` };
  }
}
