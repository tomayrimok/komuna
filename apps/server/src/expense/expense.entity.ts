import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
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

    @OneToMany(() => ExpenseSplit, s => s.expense)
    splits: ExpenseSplit[];

    @ManyToOne(() => User, (user) => user.expenses)
    paidBy: string;

    @CreateDateColumn()
    createdAt: Date;
}