// src/entities/expense-split.entity.ts
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { User } from '../user/user.entity';

@Entity()
export class ExpenseSplit {
    @PrimaryColumn()
    expenseId: string;

    @PrimaryColumn()
    userId: string;

    @ManyToOne(() => Expense, expense => expense.splits, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'expenseId' })
    expense: Expense;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column('float')
    amount: number;
}
