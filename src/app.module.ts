import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from './organizations/organizations.module';
import { UserModule } from './users/users.module';
import { SubscribersModule } from './subscribers/subscribers.module';
import { ListsModule } from './lists/lists.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ClickStatsModule } from './click_stats/click_stats.module';
import { AuthModule } from './auth/auth.module';
import { Campaign } from './campaigns/entities/campaign.entity';
import { List } from './lists/entities/list.entity';
import { ClickStat } from './click_stats/entities/click_stat.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Subscriber } from './subscribers/entities/subscriber.entity';
import { Email } from './email/entities/email.entity';
import { User } from './users/entities/user.entity';
import { Link } from './click_stats/entities/link.entity';
import { EmailModule } from './email/email.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/task.module';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: `src/.${process.env.NODE_ENV || 'test'}.env`,
      envFilePath: `src/test.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'NewsLetter',
      entities: [
        Campaign,
        ClickStat,
        List,
        Organization,
        Subscriber,
        User,
        Email,
        Link,
      ],
      synchronize: true,
    }), // postgresql
    KnexModule.forRoot({
      config: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          user: 'postgres',
          password: '123',
          database: 'newsLetter',
        },
        pool: { min: 2, max: 10 },
      },
    }),
    OrganizationsModule, // org
    UserModule, // cruds for user
    SubscribersModule, // subscribe organisations
    ListsModule,
    CampaignsModule,
    ClickStatsModule,
    AuthModule,
    EmailModule, // for emails sending and receiving
    ScheduleModule.forRoot(),
    TasksModule, // cron jobs (calls for every day)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
