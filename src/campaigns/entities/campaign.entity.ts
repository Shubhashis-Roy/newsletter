import { ClickStat } from '../../click_stats/entities/click_stat.entity';
import { List } from '../../lists/entities/list.entity';
import { Organization } from '../../organizations/entities/organization.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  subject: string;

  @Column('text')
  content: string;

  @ManyToOne(() => List, (list) => list.campaigns, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => Organization, (organization) => organization.campaigns, {
    onDelete: 'CASCADE',
  })
  organization: Organization;

  @OneToMany(() => ClickStat, (clickStat) => clickStat.campaign)
  clickStats: ClickStat[];

  @Column({ default: false })
  click_tracking_disabled: boolean;

  @Column({ default: false })
  open_tracking_disabled: boolean;

  @Column({ default: 0 })
  opened: number;

  @CreateDateColumn()
  createdAt: Date;
}
