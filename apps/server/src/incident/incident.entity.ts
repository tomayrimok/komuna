import { IncidentStatus, IncidentUrgency } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
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

@Entity()
export class Incident {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  incidentId: string;

  @ApiProperty()
  @Column()
  apartmentId: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column('json', { nullable: true })
  images?: string[];

  @ApiProperty({ enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  @Column({ type: 'enum', enum: IncidentUrgency })
  urgencyLevel: IncidentUrgency;

  @ApiProperty()
  @Column()
  reporterId: string;

  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @ApiProperty()
  @Column({ default: false })
  seenByManager: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  managerResponse: string;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.incident, {
    cascade: true,
    eager: false
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

  @Column('text', { array: true, nullable: true })
  images?: string[];

  @ManyToOne(() => Incident, i => i.comments)
  @JoinColumn({ name: 'incidentId' })
  incident: Incident;
}
