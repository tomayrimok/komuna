// src/entities/apartment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
    aid: string;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    pincode: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column({ nullable: true })
    managerId: string;

    @Column()
    contract: string;

    @Column()
    billsDetails: string;

    @OneToMany(() => UserApartment, ua => ua.aid)
    residents: UserApartment[];

    @OneToMany(() => Task, task => task.aid)
    tasks: Task[];

    @OneToMany(() => Expense, e => e.aid)
    expenses: Expense[];

    @OneToMany(() => Payment, p => p.aid)
    payments: Payment[];

    @OneToMany(() => Incident, i => i.aid)
    incidents: Incident[];

    @OneToMany(() => ShoppingTemplate, st => st.aid)
    shoppingTemplates: ShoppingTemplate[];

    @OneToMany(() => ShoppingList, sl => sl.contextId)
    shoppingLists: ShoppingList[];
}