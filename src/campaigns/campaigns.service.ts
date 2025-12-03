import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from './entities/campaign.entity';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { List } from '../lists/entities/list.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Subscriber } from '../subscribers/entities/subscriber.entity';
import { InjectKnex } from 'nestjs-knex';
import { EmailService } from '../email/email.service';
import { ListService } from '../lists/lists.service';
import { Knex } from 'knex';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    private readonly emailService: EmailService,
    private readonly listService: ListService, 
    @InjectKnex() private readonly knex: Knex,
  ) { }

  async createCampaign(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const campaign = new Campaign();
    campaign.subject = createCampaignDto.subject;
    campaign.content = createCampaignDto.content;

    if (createCampaignDto.listId) {
      const list = await this.listRepository.findOne({ where: { id: createCampaignDto.listId } });
      if (list) {
        campaign.list = list;
      }
    }

    if (createCampaignDto.organizationId) {
      const organization = await this.organizationRepository.findOne({ where: { id: createCampaignDto.organizationId } });
      if (organization) {
        campaign.organization = organization;
      }
    }

    return this.campaignRepository.save(campaign);
  }

  async listCampaigns(): Promise<Campaign[]> {
    return this.campaignRepository.find({
      relations: ['list', 'organization'],
      order: { createdAt: 'DESC' },
    });
  }

   async sendCampaign(
    id: string,
    filters?: Record<string, any>,
  ): Promise<any> {
    // find campaign
    const campaign = await this.campaignRepository.findOne({
      where: { id },
      relations: ['list', 'organization'],
    });

    if (!campaign) throw new NotFoundException('Campaign not found');

    // Segment subscribers using working segmentation function
    const segmented = await this.listService.segmentSubscribers(
      campaign.list.id,
      filters || {},
    );

    const subscribers = segmented.data;

    if (!subscribers.length) {
      return { message: 'No subscribers matched segmentation filters' };
    }

    let successCount = 0;
    let failedCount = 0;

    for (const sub of subscribers) {
      try {
        await this.emailService.sendEmail(
          sub.email,
          campaign.subject,
          campaign.content,
        );
        successCount++;
      } catch (err) {
        console.error(`Failed to send to ${sub.email}:`, err.message);
        failedCount++;
      }
    }

    return {
      campaignId: campaign.id,
      message: `Campaign "${campaign.subject}" completed.`,
      totalSubscribers: subscribers.length,
      filters: filters || {},
      sent: successCount,
      failed: failedCount,
    };
  }

  async getTrackingSettingsByCidTx(
    tx: Knex.Transaction,
    cid: string,
  ) {
    try {
      const entity = await tx('campaigns')
        .where('campaigns.id', cid)
        .select(['campaigns.id', 'campaigns.click_tracking_disabled', 'campaigns.open_tracking_disabled'])
        .first();
      if (!entity) {
        throw new NotFoundException(`Campaign with CID ${cid} not found`);
      }
      return entity;
    } catch (error) {
      console.error('Error fetching campaign tracking settings:', error);
      throw error;
    }
  }
}