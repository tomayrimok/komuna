import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { UserCompletionStatus } from './dto/user-completion-status.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RecurrenceRuleDto } from '../recurrence-rule/recurrence-rule.dto';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  taskId: string;

  @Column()
  apartmentId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column('json', { nullable: true })
  completions: UserCompletionStatus[];

  @Column('time', { nullable: true })
  dueTime?: string;

  @Column({ default: false })
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

  // task.entity.ts
  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  assignedTo: User[];
}
