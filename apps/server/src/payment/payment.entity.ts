import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    paymentId: string;

    @Column()
    apartmentId: string;

    @Column()
    fromId: string;

    @Column()
    toId: string;

    @Column('float')
    amount: number;

    @Column()
    createdAt: Date;
}