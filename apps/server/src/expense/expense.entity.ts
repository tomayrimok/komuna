import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { ExpenseSplit } from '../expense-split/expense-split.entity';

@Entity()
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    expenseId: string;

    @Column()
    apartmentId: string;

    @Column()
    description: string;

    @Column('float')
    amount: number;

    @Column()
    paidById: string;

    @OneToMany(() => ExpenseSplit, s => s.expense)
    @JoinColumn({ name: 'expenseId' })
    splits: ExpenseSplit[];

    @ManyToOne(() => User, (user) => user.expenses)
    @JoinColumn({ name: "paidById" })
    paidByUser: User;

    @CreateDateColumn()
    createdAt: Date;
}