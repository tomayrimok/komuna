import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { IncidentStatus } from '../types/enums/IncidentStatus.enum';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    incidentId: string;

    @Column()
    apartmentId: string; //todo longer name?

    @Column()
    title: string;

    @Column()
    description: string;

    @Column('json')
    images: string[];

    @Column('int')
    urgencyLevel: number;

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

    @CreateDateColumn()
    createdAt: Date;
}
