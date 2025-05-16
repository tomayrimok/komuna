import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  incidentId: string;

  @Column()
  apartmentId: string; //todo longer name?

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('json')
  images: string[];

  @Column({ type: 'enum', enum: IncidentUrgency })
  urgencyLevel: IncidentUrgency;

  @Column()
  reporterId: string;

  @Column({ type: 'enum', enum: IncidentStatus })
  status: IncidentStatus;

  @Column()
  seenByManager: boolean;

  @Column({ nullable: true })
  managerResponse: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column('json')
  comments: {
    commentId: string;
    message: string;
    userId: string;
    createAt: string;
    images: string;
  }[]; //TODO image should be optional?
}
