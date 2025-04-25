import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

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

    @Column('json', { nullable: true })
    splits: { [userId: string]: number };

    @ManyToOne(() => User, (user) => user.expenses)
    @JoinColumn({ name: "paidById" })
    paidByUser: User;

    @CreateDateColumn()
    createdAt: Date;
}