import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { User } from '../user/user.entity';

@Entity()
export class ExpenseSplit {
  @PrimaryColumn()
  expenseId: string;

  @PrimaryColumn()
  userId: string;

  @Column('float')
  amount: number;

  @ManyToOne(() => Expense, (expense) => expense.splits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
