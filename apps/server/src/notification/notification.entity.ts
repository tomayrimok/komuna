import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ContextType, UserRole } from '@komuna/types';
import * as admin from 'firebase-admin';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notificationId: string;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: ContextType })
  contextType: ContextType;

  @Column()
  contextId: string;

  @Column({ type: 'enum', enum: UserRole, array: true })
  roles: UserRole[];

  @Column({ type: 'jsonb' })
  payload: admin.messaging.MessagingPayload;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  sent: boolean;
}
