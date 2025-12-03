import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateClickStatDto } from './dto/create-click_stat.dto';
import { ClickStatService } from './click_stats.service';
import { UserRole } from '../users/entities/user.entity';
import { Roles } from '../auth/role.decorator';
import { Response } from 'express';

@Controller('click-stats')
// @UseGuards(RolesGuard)
export class ClickStatController {
  constructor(private readonly clickStatService: ClickStatService) {}

  private readonly trackImg = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64',
  );
  private readonly LinkId = {
    OPEN: -1,
    GENERAL_CLICK: 0,
  };

  @Post()
  // @Roles(UserRole.ADMIN)
  create(@Body() createClickStatDto: CreateClickStatDto) {
    return this.clickStatService.create(createClickStatDto);
  }

  @Get()
  findAll() {
    return this.clickStatService.findAll();
  }

  @Get(':campaign/:list/:subscription/:link')
  async resolveLink(
    @Param('campaign') campaign: string,
    @Param('list') list: string,
    @Param('subscription') subscription: string,
    @Param('link') link: string,
    @Res() res: Response,
  ) {
    const resolvedLink = await this.clickStatService.resolve(link);

    if (resolvedLink) {
      // Redirect to the resolved URL
      res.redirect(302, resolvedLink.url);

      // Count the link usage
      await this.clickStatService.countLink(
        res.req.ip,
        res.req.headers['user-agent'],
        campaign,
        list,
        subscription,
        resolvedLink.id,
      );
    } else {
      // Log the error and throw a Not Found exception
      console.error('Redirect', `Unresolved URL: <${res.req.url}>`);
      throw new HttpException(
        "Oops, we couldn't find a link for the URL you clicked",
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('track/:campaignId')
  async trackClick(
    @Param('campaignId') campaignId: string,
    @Query('link') link: string,
    @Res() res: Response,
  ) {
    const realLink = await this.clickStatService.trackAndRedirect(campaignId, link);

    return res.redirect(realLink);
  }

  @Get(':campaign/:list/:subscription')
  async trackOpen(
    @Param('campaign') campaign: string,
    @Param('list') list: string,
    @Param('subscription') subscription: string,
    @Res() res: Response,
  ) {
    res.writeHead(200, {
      'Content-Type': 'image/gif',
      'Content-Length': this.trackImg.length,
    });

    // Send the tracking image
    res.end(this.trackImg);

    // Count the link open event
    await this.clickStatService.countLink(
      res.req.ip,
      res.req.headers['user-agent'],
      campaign,
      list,
      subscription,
      this.LinkId.OPEN,
    );
  }
}
