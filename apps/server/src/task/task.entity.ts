import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { RecurrenceRuleDto } from '@komuna/types';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  taskId: string;

  @Column()
  apartmentId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  // task.entity.ts
  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  assignedTo: User[];

  @Column()
  isCompleted: boolean;

  @Column()
  dueDate: Date;

  @Column()
  isRecurrent: boolean;

  @Column('json', { nullable: true })
  recurrenceRule?: RecurrenceRuleDto;

  @Column()
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;
}
