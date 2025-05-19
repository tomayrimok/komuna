import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DebtEdge {
    @PrimaryGeneratedColumn('uuid')
    debtId: string;

    @Column()
    apartmentId: string;

    @Column()
    fromId: string;

    @Column()
    toId: string;

    @Column('float')
    amount: number;

    @UpdateDateColumn()
    updatedAt: Date;
}