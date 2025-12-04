import {
  Controller,
  Post,
  Patch,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CampaignService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
  ) {}

  @Post()
  async createCampaign(
    @Body() createCampaignDto: CreateCampaignDto,
  ) {
    return this.campaignService.createCampaign(
      createCampaignDto,
    );
  }

  @Get()
  async listCampaigns() {
    return this.campaignService.listCampaigns();
  }

  @Post(':id/send')
  async sendCampaign(
    @Param('id') id: string,
    @Body()
    filters?: { country?: string; tag?: string },
  ) {
    return this.campaignService.sendCampaign(
      id,
      filters,
    );
  }

  // ────────────────────────────────────────────────
  // ⭐ PATCH RSS Feed (Add / Update RSS Feed)
  // ────────────────────────────────────────────────
  @Patch(':id/rss-feed')
  async updateRssFeed(
    @Param('id') id: string,
    @Body('rssFeed') rssFeed: string,
  ) {
    return this.campaignService.updateRssFeed(
      id,
      rssFeed,
    );
  }
}
