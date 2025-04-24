import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Expense } from '../expense/expense.entity';
import { DebtEdge } from '../debt-edge/debt-edge.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column({ nullable: true })
    verificationCode?: string;

    @OneToMany(() => UserApartment, ua => ua.userId)
    apartments: UserApartment[];

    @OneToMany(() => UserApartment, ua => ua.payableByUser)
    payableRents: UserApartment[];

    @OneToMany(() => Expense, e => e.paidByUser)
    expenses: Expense[];

    @OneToMany(() => DebtEdge, d => d.fromUser)
    debts: DebtEdge[];

    @OneToMany(() => DebtEdge, d => d.toUser)
    credits: DebtEdge[];

    @CreateDateColumn()
    createdAt: Date;
}