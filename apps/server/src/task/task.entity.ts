import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { RecurrenceRuleDto } from '@komuna/types';
import { User } from '../user/user.entity';
import { UserCompletionStatus } from './dto/user-completion-status.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  taskId: string;

  @Column()
  apartmentId: string;

  @Column()
  title: string;

  @Column()
  description?: string;

  // task.entity.ts
  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  assignedTo: User[];

  @Column('json', { nullable: true })
  completions: UserCompletionStatus[];

  @Column()
  dueDate?: Date;

  @Column('time', { nullable: true })
  dueTime?: string;

  @Column()
  isRecurrent: boolean;

  @Column('json', { nullable: true })
  recurrenceRule?: RecurrenceRuleDto;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, (user) => user.createdTasks, { eager: true })
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @CreateDateColumn()
  createdAt: Date;
}
