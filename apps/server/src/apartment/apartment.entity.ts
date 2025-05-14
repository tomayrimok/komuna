import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Task } from '../task/task.entity';
import { Expense } from '../expense/expense.entity';
import { Payment } from '../payment/payment.entity';
import { Incident } from '../incident/incident.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';


@Entity()
export class Apartment {
    @PrimaryGeneratedColumn('uuid')
    apartmentId: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    image?: string;

    @Column({ unique: true })
    code: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    managerId?: string;

    @Column({ nullable: true })
    contract?: string;

    @Column({ nullable: true })
    billsDetails?: string;

    @OneToMany(() => UserApartment, ua => ua.apartment)
    residents: UserApartment[];

    @OneToMany(() => Task, task => task.apartmentId)
    tasks: Task[];

    @OneToMany(() => Expense, e => e.apartmentId)
    expenses: Expense[];

    @OneToMany(() => Payment, p => p.apartmentId)
    payments: Payment[];

    @OneToMany(() => Incident, i => i.apartmentId)
    incidents: Incident[];

    @OneToMany(() => ShoppingTemplate, st => st.apartmentId)
    shoppingTemplates: ShoppingTemplate[];

    @OneToMany(() => ShoppingList, sl => sl.contextId)
    shoppingLists: ShoppingList[];

    @CreateDateColumn()
    createdAt: Date;
}