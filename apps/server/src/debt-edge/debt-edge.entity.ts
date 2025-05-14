import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

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

    @ManyToOne(() => User, (user) => user.debts)
    @JoinColumn({ name: "fromId" })
    fromUser: User;

    @ManyToOne(() => User, (user) => user.credits)
    @JoinColumn({ name: "toId" })
    toUser: User;
}