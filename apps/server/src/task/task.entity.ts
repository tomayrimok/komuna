import { TaskType } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecurrenceRuleDto } from '../recurrence-rule/recurrence-rule.dto';
import { User } from '../user/user.entity';

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

  @Column({ type: 'enum', enum: TaskType, default: TaskType.GROUP })
  taskType?: TaskType;

  @Column({ type: 'text', array: true, default: [] })
  completions: string[];

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
