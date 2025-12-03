import { Organization } from '../../organizations/entities/organization.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, unique: true })
    email: string;

    @Column({ length: 255 })
    fullName: string;

    @Column({ length: 255 })
    password: string;

    @ManyToOne(() => Organization, organization => organization.users, { onDelete: 'SET NULL' })
    organization: Organization;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}