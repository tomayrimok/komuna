import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Task } from '../task/task.entity';
import { Expense } from '../expense/expense.entity';
import { Payment } from '../payment/payment.entity';
import { Incident } from '../incident/incident.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { User } from '../user/user.entity';

export interface BillsDetails {
    electricity?: string;
    water?: string;
    internet?: string;
    gas?: string;
};

@Entity()
export class Apartment {
    @PrimaryGeneratedColumn('uuid')
    apartmentId: string;

    /** Apartment Info */
    @Column()
    name: string;

    @Column({ nullable: true })
    image?: string;

    /** The code to join the apartment. NULL in case the apartment doesn't allow new residents */
    @Column({ unique: true })
    code: string;

    /** Apartment Info */
    @Column({ nullable: true })
    address?: string;

    /** Apartment Info */
    @Column({ nullable: true })
    city?: string;

    /** Apartment Settings */
    @Column({ type: 'date', nullable: true })
    contractEndDate?: Date;

    /** Apartment Settings */
    /** contract file UserRole */
    @Column({ nullable: true })
    contractUrl?: string;

    /** Apartment Settings */
    @Column({ type: 'float', nullable: true })
    rent?: number;


    /** בעל הבית */
    @Column({ nullable: true })
    managerId?: string;

    /** Apartment Settings */
    /** Bills' locations */
    @Column({ type: 'json', nullable: true })
    billsDetails?: BillsDetails;

    /** Renter Settings */
    /** מחיר חושי ועד בית */
    @Column({ type: 'float', nullable: true })
    houseCommitteeRent: number;

    /** Renter Settings */
    /** The user id of who pays the house committee, or NULL if it's split equally */
    @ManyToOne(() => User, (u) => u.payableHouseCommitteeRents, { nullable: true, cascade: true })
    @JoinColumn({ name: 'houseCommitteePayerUserId' })
    houseCommitteePayerUser?: User;

    @OneToMany(() => UserApartment, ua => ua.apartmentId, { cascade: true })
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
