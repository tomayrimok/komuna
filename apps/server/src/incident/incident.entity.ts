import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  incidentId: string;

  @Column()
  apartmentId: string;

  @Column()
  title: string;

  @Column()
  description: string;

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

  @Column()
  updatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.incident, {
    cascade: true,
    eager:   false
  })
  comments: Comment[];
}

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  commentId: string;

  @Column()
  message: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  incidentId: string;

  @ManyToOne(() => Incident, i => i.comments)
  @JoinColumn({ name: 'incidentId' })
  incident: Incident;
}
