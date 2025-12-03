import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClickStatController } from './click_stats.controller';
import { ClickStatService } from './click_stats.service';
import { ClickStat } from './entities/click_stat.entity';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { AuthModule } from '../auth/auth.module';
import { Link } from './entities/link.entity';
import { List } from '../lists/entities/list.entity';
import { Subscriber } from '../subscribers/entities/subscriber.entity';
import { ListsModule } from '../lists/lists.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { SubscribersModule } from '../subscribers/subscribers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClickStat, Campaign, Link, List, Subscriber]),
    AuthModule,
    ListsModule,
    CampaignsModule,
    SubscribersModule,
  ],
  controllers: [ClickStatController],
  providers: [ClickStatService],
  exports: [ClickStatService],
})
export class ClickStatsModule {}
