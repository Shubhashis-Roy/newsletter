import { Module } from '@nestjs/common';
import { SubscriberController } from './subscribers.controller';
import { SubscriberService } from './subscribers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber, Organization]),
    AuthModule
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService]
})
export class SubscribersModule {}