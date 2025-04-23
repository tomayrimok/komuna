import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

    @Column()
    assignedTo: string;

    @Column()
    isCompleted: boolean;
}