import { Campaign } from '../../campaigns/entities/campaign.entity';
import { List } from '../../lists/entities/list.entity';
import { Subscriber } from '../../subscribers/entities/subscriber.entity';
import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';


@Entity('organizations')
export class Organization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @OneToMany(() => List, list => list.organization)
    lists: List[];

    @OneToMany(() => Subscriber, subscriber => subscriber.organization)
    subscribers: Subscriber[];

    @OneToMany(() => User, user => user.organization)
    users: User[];

    @OneToMany(() => Campaign, campaign => campaign.organization)
    campaigns: Campaign[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}