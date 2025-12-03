import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  cid: string;

  @Column({ type: 'varchar', length: 2048 })
  url: string;

  @Column({ type: 'int', default: 0 })
  hits: number;

  @Column({ type: 'int', default: 0 })
  visits: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
export const LinkId = {
  OPEN: -1,
  GENERAL_CLICK: 0
};