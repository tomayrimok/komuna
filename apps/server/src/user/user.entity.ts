import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Expense } from '../expense/expense.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    image: string;

    @Column()
    phoneNumber: string;

    @Column()
    verificationCode: string;

    @OneToMany(() => UserApartment, ua => ua.userId)
    apartments: UserApartment[];

    @OneToMany(() => UserApartment, ua => ua.payableByUser)
    payableRents: UserApartment[];

    @OneToMany(() => Expense, e => e.paidBy)
    expenses: Expense[];
}