import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  assignedTo?: string;

  @Column()
  isCompleted: boolean;

  @Column()
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
