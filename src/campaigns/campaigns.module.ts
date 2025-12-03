import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignService } from './campaigns.service';
import { CampaignController } from './campaigns.controller';
import { Campaign } from './entities/campaign.entity';
import { List } from '../lists/entities/list.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Subscriber } from '../subscribers/entities/subscriber.entity';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { ListsModule } from '../lists/lists.module';

@Module({ 
  imports: [
    TypeOrmModule.forFeature([Campaign, List, Organization, Subscriber]),
    AuthModule, EmailModule, ListsModule
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService]
})
export class CampaignsModule {}