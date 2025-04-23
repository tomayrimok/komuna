import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
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

    // @Column('json')
    // splits: { userId: string; amount: number }[];

    @OneToMany(() => ExpenseSplit, s => s.expense)
    splits: ExpenseSplit[];

    @Column()
    createdAt: Date;

    // paid by is a relation to the user who paid the expense
    @ManyToOne(() => User, (user) => user.expenses)
    paidBy: string;
}