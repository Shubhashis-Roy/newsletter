import { Module } from '@nestjs/common';
import { TasksService } from './task.service';
import { EmailService } from '../email/email.service';

@Module({
    providers: [TasksService, EmailService],
})
export class TasksModule { }