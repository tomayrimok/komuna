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
  OneToOne,
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

  @Column('json', { nullable: true })
  images?: string[];

  @ApiProperty({ enum: IncidentUrgency, enumName: 'IncidentUrgency' })
  @Column({ type: 'enum', enum: IncidentUrgency })
  urgencyLevel: IncidentUrgency;

  @Column()
  reporterId: string;

  @ApiProperty({ enum: IncidentStatus, enumName: 'IncidentStatus' })
  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.OPEN })
  status: IncidentStatus;

  @Column({ default: false })
  seenByManager: boolean;

  @Column({ nullable: true })
  managerResponse: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.incident, {
    cascade: true,
    eager: false
  })
  comments: Comment[];

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.incidents, { eager: true })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;
}

@Entity()
export class Comment {

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  commentId: string;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @Column()
  userId: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  incidentId: string;

  @ApiProperty()
  @Column('text', { array: true, nullable: true })
  images?: string[];

  @ApiProperty()
  @ManyToOne(() => User, user => user.comments, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: string;

  @ManyToOne(() => Incident, i => i.comments)
  @JoinColumn({ name: 'incidentId' })
  incident: Incident;
}
