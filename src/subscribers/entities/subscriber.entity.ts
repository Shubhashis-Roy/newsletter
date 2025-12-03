import { Organization } from '../../organizations/entities/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

@Entity('subscribers')
export class Subscriber {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    email: string;

    @ManyToOne(() => Organization, organization => organization.subscribers, { onDelete: 'CASCADE' })
    organization: Organization;

    @Column('jsonb', { nullable: true })
    customFields: object;

    @CreateDateColumn()
    createdAt: Date;
}