import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { TaskType } from '../types/enums/TaskType.enum';

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

    @Column({ type: 'enum', enum: TaskType })
    taskType: TaskType;

    @Column()
    isCompleted: boolean;

    @Column()
    date: Date;

    @CreateDateColumn()
    createdAt: Date;
}