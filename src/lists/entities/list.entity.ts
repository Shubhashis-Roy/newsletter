import { Campaign } from '../../campaigns/entities/campaign.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Organization, (organization) => organization.lists, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @Column('jsonb', { nullable: true })
  customFields: object;

  @OneToMany(() => Campaign, (campaign) => campaign.list)
  campaigns: Campaign[];

  @CreateDateColumn()
  createdAt: Date;
}

// export const entityTypes: = {
//     namespace: {
//         entitiesTable: 'namespaces',
//         sharesTable: 'shares_namespace',
//         permissionsTable: 'permissions_namespace',
//         clientLink: id => /namespaces/${id}
//     },
//     list: {
//         entitiesTable: 'lists',
//         sharesTable: 'shares_list',
//         permissionsTable: 'permissions_list',
//         clientLink: id => /lists/${id}
//     },
//     customForm: {
//         entitiesTable: 'custom_forms',
//         sharesTable: 'shares_custom_form',
//         permissionsTable: 'permissions_custom_form',
//         clientLink: id => /lists/forms/${id}
//     },
//     campaign: {
//         entitiesTable: 'campaigns',
//         sharesTable: 'shares_campaign',
//         permissionsTable: 'permissions_campaign',
//         dependentPermissions: {
//             extraColumns: ['parent'],
//             getParent: entity => entity.parent
//         },
//         files: {
//             file: {
//                 table: 'files_campaign_file',
//                 permissions: {
//                     view: 'viewFiles',
//                     manage: 'manageFiles'
//                 },
//                 defaultReplacementBehavior: ReplacementBehavior.REPLACE
//             },
//             attachment: {
//                 table: 'files_campaign_attachment',
//                 inUseTable: 'files_campaign_attachment_usage',
//                 permissions: {
//                     view: 'viewAttachments',
//                     manage: 'manageAttachments'
//                 },
//                 defaultReplacementBehavior: ReplacementBehavior.NONE
//             }
//         },
//         clientLink: id => /campaigns/${id}
//     },
//     channel: {
//         entitiesTable: 'channels',
//         sharesTable: 'shares_channel',
//         permissionsTable: 'permissions_channel',
//         clientLink: id => /channels/${id}
//     },
//     template: {
//         entitiesTable: 'templates',
//         sharesTable: 'shares_template',
//         permissionsTable: 'permissions_template',
//         files: {
//             file: {
//                 table: 'files_template_file',
//                 permissions: {
//                     view: 'viewFiles',
//                     manage: 'manageFiles'
//                 },
//                 defaultReplacementBehavior: ReplacementBehavior.REPLACE
//             }
//         },
//         clientLink: id => /templates/${id}
//     },
//     sendConfiguration: {
//         entitiesTable: 'send_configurations',
//         sharesTable: 'shares_send_configuration',
//         permissionsTable: 'permissions_send_configuration',
//         clientLink: id => /send-configurations/${id}
//     },
//     report: {
//         entitiesTable: 'reports',
//         sharesTable: 'shares_report',
//         permissionsTable: 'permissions_report',
//         clientLink: id => /reports/${id}
//     },
//     reportTemplate: {
//         entitiesTable: 'report_templates',
//         sharesTable: 'shares_report_template',
//         permissionsTable: 'permissions_report_template',
//         clientLink: id => /reports/templates/${id}
//     },
//     mosaicoTemplate: {
//         entitiesTable: 'mosaico_templates',
//         sharesTable: 'shares_mosaico_template',
//         permissionsTable: 'permissions_mosaico_template',
//         files: {
//             file: {
//                 table: 'files_mosaico_template_file',
//                 permissions: {
//                     view: 'viewFiles',
//                     manage: 'manageFiles'
//                 },
//                 defaultReplacementBehavior: ReplacementBehavior.REPLACE
//             },
//             block: {
//                 table: 'files_mosaico_template_block',
//                 permissions: {
//                     view: 'viewFiles',
//                     manage: 'manageFiles'
//                 },
//                 defaultReplacementBehavior: ReplacementBehavior.REPLACE
//             }
//         },
//         clientLink: id => /templates/mosaico/${id}
//     },
//     user: {
//         entitiesTable: 'users',
//         clientLink: id => /users/${id}
//     }
// };

// export const getEntityTypes=()=> {
//     return entityTypes;
// }
