import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Subscriber } from './entities/subscriber.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { InjectKnex } from 'nestjs-knex';
import { Knex } from 'knex';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    @InjectKnex() private readonly knex: Knex,
  ) {}

  async create(createSubscriberDto: CreateSubscriberDto) {
    const subscriber = new Subscriber();
    subscriber.email = createSubscriberDto.email;
    subscriber.customFields = createSubscriberDto.customFields;

    if (createSubscriberDto.organizationId) {
      const organization = await this.organizationRepository.findOne({
        where: { id: createSubscriberDto.organizationId },
      });
      if (organization) {
        subscriber.organization = organization;
      }
    }

    return this.subscriberRepository.save(subscriber);
  }

  findAll(page: number, limit: number) {
    return this.subscriberRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['organization'],
    });
  }

  async update(id: string, updateSubscriberDto: UpdateSubscriberDto) {
    const subscriber = await this.subscriberRepository.findOne({
      where: { id },
    });
    if (!subscriber) {
      throw new Error('Subscriber not found');
    }

    if (updateSubscriberDto.email) subscriber.email = updateSubscriberDto.email;
    if (updateSubscriberDto.customFields)
      subscriber.customFields = updateSubscriberDto.customFields;

    if (updateSubscriberDto.organizationId) {
      const organization = await this.organizationRepository.findOne({
        where: { id: updateSubscriberDto.organizationId },
      });
      if (organization) {
        subscriber.organization = organization;
      }
    }
    return this.subscriberRepository.save(subscriber);
  }

  async getByCidTx(
    tx: Knex.Transaction,
    listId: string,
    subscriptionCid: string,
  ) {
    return await this._getByTx(tx, listId, 'id', subscriptionCid);
  }

  private async _getByTx(
    tx: Knex.Transaction,
    listId: string,
    key: string,
    value: string,
  ) {
    const subscription = await tx('subscribers')
      // .where({ [key]: value, list_id: listId })
      .where({ [key]: value })
      .first();
    console.log("subscription", subscription);
    if (!subscription) {
      throw new NotFoundException(
        `Subscription with ${key} ${value} not found for list ID ${listId}`,
      );
    }
    return subscription;
  }
  getSubscriptionTableName() {
    // return `subscription__${listId}`;
    return `subscription`;
  }
}
