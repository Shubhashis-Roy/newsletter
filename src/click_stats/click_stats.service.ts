import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClickStat } from './entities/click_stat.entity';
import { CreateClickStatDto } from './dto/create-click_stat.dto';
import { Campaign } from '../campaigns/entities/campaign.entity';
import { Link, LinkId } from './entities/link.entity';
import { InjectKnex, Knex } from 'nestjs-knex';
// import geoip from 'geoip-ultralight';
import * as geoip from 'geoip-lite';
import * as UAParser from 'ua-parser-js';
// import uaParser from 'device';
// import UAParser from 'ua-parser-js';
import { Subscriber } from '../subscribers/entities/subscriber.entity';
import { ListService } from '../lists/lists.service';
import { CampaignService } from '../campaigns/campaigns.service';
import { SubscriberService } from '../subscribers/subscribers.service';
// import { ContextService } from './context'
import { List } from '../lists/entities/list.entity';

@Injectable()
export class ClickStatService {
  constructor(
    @InjectKnex() private readonly knex: Knex,
    @InjectRepository(ClickStat)
    private clickStatRepository: Repository<ClickStat>,
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(Subscriber)
    private readonly subscriberRepository: Repository<Subscriber>,
    private listService: ListService,
    private campaignService: CampaignService,
    private subscriberService: SubscriberService,
    // private contextService: ContextService
  ) { }

  async create(createClickStatDto: CreateClickStatDto) {
    const clickStat = new ClickStat();
    clickStat.link = createClickStatDto.link;
    clickStat.clickCount = createClickStatDto.clickCount || 0;

    if (createClickStatDto.campaignId) {
      const campaign = await this.campaignRepository.findOne({
        where: { id: createClickStatDto.campaignId },
      });
      if (campaign) {
        clickStat.campaign = campaign;
      } else {
        throw new Error('Campaign not found');
      }
    } else {
      throw new Error('Campaign ID is required');
    }

    return this.clickStatRepository.save(clickStat);
  }

  findAll() {
    return this.clickStatRepository.find({ relations: ['campaign'] });
  }

  async incrementClickCount(id: string) {
    const clickStat = await this.clickStatRepository.findOne({ where: { id } });
    if (!clickStat) {
      throw new Error('ClickStat not found');
    }
    clickStat.clickCount += 1;
    return this.clickStatRepository.save(clickStat);
  }

  async resolve(linkCid: string): Promise<Link | null> {
    return await this.linkRepository.findOne({ where: { cid: linkCid } });
  }

  async trackAndRedirect(campaignId: string, link: string): Promise<string> {
    // Find existing stat
    let clickStat = await this.clickStatRepository.findOne({
      where: { campaign: { id: campaignId }, link },
      relations: ['campaign'],
    });

    // Increment or create
    if (clickStat) {
      clickStat.clickCount += 1;
    } else {
      clickStat = this.clickStatRepository.create({
        campaign: { id: campaignId },
        link,
        clickCount: 1,
      });
    }

    await this.clickStatRepository.save(clickStat);

    return link;
  }

  async countLink(
    remoteIp: string,
    userAgent: string,
    campaignCid: string,
    listCid: string,
    subscriptionCid: string,
    linkId: number,
  ) {
    // Use a transaction for atomic operations
    await this.knex.transaction(async (tx) => {
      console.log('g');
      const list = await this.listService.getByCidTx(tx, listCid);
      console.log('list', list);
      const campaign = await this.campaignService.getTrackingSettingsByCidTx(
        tx,
        campaignCid,
      );
      console.log('camp', campaign);
      const subscription = await this.subscriberService.getByCidTx(
        tx,
        list.id,
        subscriptionCid,
      );
      console.log("subs", subscription);
      // const country = geoip.lookup(remoteIp).country || null;
      // const country = 'geoip.lookup(remoteIp).country';
      const geo = geoip.lookup(remoteIp);


      const uaParser = new UAParser();
      // const userAgent = request.headers['user-agent'];  // Get user-agent from headers
      const uaData = uaParser.setUA(userAgent).getResult(); // Parse user-agent string
      console.log(uaData);
      // const device = {
      //   type: parsedData.device.type || 'desktop', // Default to 'desktop' if device type is unknown or empty
      //   brand: parsedData.device.vendor || 'unknown', // Default to 'unknown' for brand
      //   model: parsedData.device.model || 'unknown', // Default to 'unknown' for model
      // };
      // const device = uaParser.parse(userAgent, {
      //   unknownUserAgentDeviceType: 'desktop',
      //   emptyUserAgentDeviceType: 'desktop',
      // });
      const now = new Date();

      // Helper function to handle inserting and updating clicks
      const _countLink = async (clickLinkId: number) => {
        try {
          // const campaignLinksQry = this.knex('campaign_links')
          //   .insert({
          //     campaign: campaign.id,
          //     list: list.id,
          //     subscription: subscription.id,
          //     link: clickLinkId,
          //     ip: remoteIp,
          //     device_type: 'device.type',
          //     country,
          //   })
          //   .toSQL();
          // console.log(campaignLinksQry);
          // const campaignLinksQryResult = await tx.raw(
          //   campaignLinksQry.sql +
          //     (incrementOnDup
          //       ? ' ON DUPLICATE KEY UPDATE `count`=`count`+1'
          //       : ''),
          //   campaignLinksQry.bindings,
          // );

          const campaignLinksQry = this.knex('campaign_links')
            .insert({
              campaign: campaign.id,
              list: list.id,
              subscription: subscription.id,
              link: clickLinkId,
              ip: remoteIp,
              device_type: uaData.device,
              country: geo,
              count: 1,
            })
            .onConflict(['campaign']) // Specify the columns for conflict
            .merge({ count: this.knex.raw('"campaign_links"."count" + 1') })
            .returning('*')
            .toSQL();

          const campaignLinksQryResult = await tx.raw(
            campaignLinksQry.sql,
            campaignLinksQry.bindings,
          );

          console.log(campaignLinksQryResult);

          // const campaignLinksQry = this.knex('campaign_links')
          //   .insert({
          //     campaign: campaign.id,
          //     list: list.id,
          //     subscription: subscription.id,
          //     link: clickLinkId,
          //     ip: remoteIp,
          //     device_type: 'device.type',
          //     country,
          //   })
          //   .toSQL();

          // console.log(campaignLinksQry);

          // const campaignLinksQryResult = await tx.raw(
          //   campaignLinksQry.sql +
          //     (incrementOnDup
          //       ? ' ON DUPLICATE KEY UPDATE `count`=`count`+1'
          //       : ''),
          //   campaignLinksQry.bindings,
          // );

          if (campaignLinksQryResult.rows.length > 1) {
            return false;
          }

          return true;
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log("dbg")
            return false;
          }
          throw err;
        }
      };

      // Update opened and click timestamps
      const latestUpdates: { latest_click?: Date; latest_open?: Date } = {};

      if (!campaign.click_tracking_disabled && linkId > LinkId.GENERAL_CLICK) {
        latestUpdates.latest_click = now;
      }

      if (!campaign.open_tracking_disabled) {
        latestUpdates.latest_open = now;
      }

      if (latestUpdates.latest_click || latestUpdates.latest_open) {
        await tx(this.subscriberService.getSubscriptionTableName())
          .update(latestUpdates)
          .where('id', subscription.id);
      }

      // Update clicks
      if (linkId > LinkId.GENERAL_CLICK && !campaign.click_tracking_disabled) {
        await tx('links').increment('hits').where('id', linkId);
        if (await _countLink(linkId)) {
          await tx('links').increment('visits').where('id', linkId);

          // if (await _countLink(LinkId.GENERAL_CLICK, false)) {
          //   await tx('campaigns').increment('clicks').where('id', campaign.id);
          // }
        }
      }

      // Update opens
      if (!campaign.open_tracking_disabled) {
        if (await _countLink(LinkId.OPEN)) {
          await tx('campaigns').increment('opened').where('id', campaign.id);
        }
      }
    });
  }

  // async enforceEntityPermissionTx(tx, context, entityTypeId, entityId, requiredOperations) {
  //   if (!entityId) {
  //     throwPermissionDenied();
  //   }
  //   const result = await this._checkPermissionTx(tx, context, entityTypeId, entityId, requiredOperations);
  //   if (!result) {
  //     log.info(`Denying permission ${entityTypeId}.${entityId} ${requiredOperations}`);
  //     throwPermissionDenied();
  //   }
  // }

  // async _checkPermissionTx(tx, context, entityTypeId, entityId, requiredOperations) {
  //   if (!context.user) {
  //     return false;
  //   }

  //   const entityType = entitySettings.getEntityType(entityTypeId);

  //   if (typeof requiredOperations === 'string') {
  //     requiredOperations = [requiredOperations];
  //   }

  //   requiredOperations = this.filterPermissionsByRestrictedAccessHandler(context, entityTypeId, entityId, requiredOperations, 'checkPermissions');

  //   if (requiredOperations.length === 0) {
  //     return false;
  //   }

  //   if (context.user.admin) { // This handles the getAdminContext() case. In this case we don't check the permission, but just the existence.
  //     const existsQuery = tx(entityType.entitiesTable);

  //     if (entityId) {
  //       existsQuery.where('id', entityId);
  //     }

  //     const exists = await existsQuery.first();

  //     return !!exists;

  //   } else {
  //     const permsQuery = tx(entityType.permissionsTable)
  //       .where('user', context.user.id)
  //       .whereIn('operation', requiredOperations);

  //     if (entityId) {
  //       permsQuery.andWhere('entity', entityId);
  //     }

  //     const perms = await permsQuery.first();

  //     return !!perms;
  //   }
  // }

  // filterPermissionsByRestrictedAccessHandler(context, entityTypeId, entityId, permissions, operationMsg) {
  //   if (context.user.restrictedAccessHandler) {
  //     const originalOperations = permissions;
  //     if (context.user.restrictedAccessHandler.permissions) {
  //       const entityPerms = context.user.restrictedAccessHandler.permissions[entityTypeId];

  //       if (!entityPerms) {
  //         permissions = [];
  //       } else if (entityPerms === true) {
  //         // no change to operations
  //       } else if (entityPerms instanceof Set) {
  //         permissions = permissions.filter(perm => entityPerms.has(perm));
  //       } else {
  //         if (entityId) {
  //           const allowedPerms = entityPerms[entityId];
  //           if (allowedPerms) {
  //             permissions = permissions.filter(perm => allowedPerms.has(perm));
  //           } else {
  //             const allowedPerms = entityPerms['default'];
  //             if (allowedPerms) {
  //               permissions = permissions.filter(perm => allowedPerms.has(perm));
  //             } else {
  //               permissions = [];
  //             }
  //           }
  //         } else {
  //           const allowedPerms = entityPerms['default'];
  //           if (allowedPerms) {
  //             permissions = permissions.filter(perm => allowedPerms.has(perm));
  //           } else {
  //             permissions = [];
  //           }
  //         }
  //       }
  //     } else {
  //       permissions = [];
  //     }
  //     log.verbose(operationMsg + ' with restrictedAccessHandler --  entityTypeId: ' + entityTypeId + '  entityId: ' + entityId + '  operations: [' + originalOperations + '] -> [' + permissions + ']');
  //   }

  //   return permissions;
  // }

  // getSubscriptionTableName(listId) {
  //   return `subscription__${listId}`;
  // }

  // async getGroupedFieldsMapTx(tx, listId) {
  //   const groupedFields = await fields.listGroupedTx(tx, listId);
  //   const result = {};
  //   for (const fld of groupedFields) {
  //     result[getFieldColumn(fld)] = fld;
  //   }
  //   return result;
  // }

  // groupSubscription(groupedFieldsMap, entity) {
  //   for (const fldCol in groupedFieldsMap) {
  //     const fld = groupedFieldsMap[fldCol];
  //     const fieldType = fields.getFieldType(fld.type);

  //     if (fieldType.grouped) {
  //       let value = null;

  //       if (fieldType.cardinality === fields.Cardinality.SINGLE) {
  //         for (const optionKey in fld.groupedOptions) {
  //           const option = fld.groupedOptions[optionKey];

  //           if (entity[option.column]) {
  //             value = option.column;
  //           }

  //           delete entity[option.column];
  //         }

  //       } else {
  //         value = [];
  //         for (const optionKey in fld.groupedOptions) {
  //           const option = fld.groupedOptions[optionKey];

  //           if (entity[option.column]) {
  //             value.push(option.column);
  //           }

  //           delete entity[option.column];
  //         }
  //       }

  //       entity[fldCol] = value;

  //     } else if (fieldType.enumerated) {
  //       // This is enum-xxx type. We just make sure that the options we give out match the field settings.
  //       // If the field settings gets changed, there can be discrepancies between the field and the subscription data.

  //       const allowedKeys = new Set(fld.settings.options.map(x => x.key));

  //       if (!allowedKeys.has(entity[fldCol])) {
  //         entity[fldCol] = null;
  //       }
  //     }
  //   }
  // }

  // getFieldColumn(field) {
  //   return field.column || 'grouped_' + field.id;
  // }
}
