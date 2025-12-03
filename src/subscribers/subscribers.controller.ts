import { Controller, Get, Post, Body, Put, Param, Query, ParseIntPipe } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SubscriberService } from './subscribers.service';

@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly subscriberService: SubscriberService) { }

  @Post()
  create(@Body() createSubscriberDto: CreateSubscriberDto) {
    return this.subscriberService.create(createSubscriberDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ) {
    return this.subscriberService.findAll(page, limit);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSubscriberDto: UpdateSubscriberDto) {
    return this.subscriberService.update(id, updateSubscriberDto);
  }
}

// lick-stats/9b50ca2d-0341-4328-a6a7-3c95cabe7333/8f6bf916-eec4-4c38-bd22-954d32d6249d/68ada27a-554c-49d1-b4c3-541a91da38c9