import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly mailService: EmailService,
    ) { }
    private readonly logger = new Logger(TasksService.name);

    @Cron('0 9 1 * *')
    async handleCron() {
        this.logger.debug('Called every month at 1st Date, 9:00 AM');
        await this.mailService.sendEmail(
          'abc@gmail.com',
          'Remainder for collecting subscriber Report',
          'Hi User, Please collect the subscriber report within 3 days.',
        );
    }

}