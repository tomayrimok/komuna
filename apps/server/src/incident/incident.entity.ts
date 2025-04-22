
// src/entities/incident.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    aid: string; //todo longer name?

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

    @Column()
    createdAt: Date;

    @Column()
    status: 'open' | 'inprogress' | 'solved'; //todo enum

    @Column()
    seenByManager: boolean;

    @Column({ nullable: true })
    managerResponse: string;
}
