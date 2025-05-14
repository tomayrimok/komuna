import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Task } from '../task/task.entity';
import { Expense } from '../expense/expense.entity';
import { Payment } from '../payment/payment.entity';
import { Incident } from '../incident/incident.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { BillsDetails } from '@komuna/types';

@Entity()
export class Apartment {
  @ApiProperty({ description: 'Unique identifier for the apartment' })
  @PrimaryGeneratedColumn('uuid')
  apartmentId: string;

  @ApiProperty({ description: 'Name of the apartment' })
    /** Apartment Info */
  @Column()
  name: string;

  @ApiProperty({ description: 'URL to apartment image', required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ description: 'Unique code for the apartment' })
    /** The code to join the apartment. NULL in case the apartment doesn't allow new residents */
  @Column({ unique: true })
  code: string;

  @ApiProperty({ description: 'Apartment address', required: false })
    /** Apartment Info */
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ description: 'City where the apartment is located', required: false })
    /** Apartment Info */
  @Column({ nullable: true })
  city?: string;

    /** Apartment Settings */
    @Column({ type: 'date', nullable: true })
    contractEndDate?: Date;

    /** contract file UserRole */
    @Column({ nullable: true })
    contractUrl?: string;

    /** Apartment Settings */
    @Column({ type: 'float', nullable: true })
    rent?: number;


    /** בעל הבית */
  @ApiProperty({ description: 'ID of the apartment manager', required: false })
  @Column({ nullable: true })
    // TODO change to landLordId?!
  managerId?: string;

  @ApiProperty({ description: 'Apartment contract details', required: false })  
  @Column({ nullable: true })
    contract?: string;

    @ApiProperty({ description: 'Bills payment details', required: false })
    @Column({ nullable: true })
    billsDetails?: string;

    /** Renter Settings */
    /** מחיר חושי ועד בית */
    @Column({ type: 'float', nullable: true })
    houseCommitteeRent: number;

    /** Renter Settings */
    /** The user id of who pays the house committee, or NULL if it's split equally */
    @ManyToOne(() => User, (u) => u.userId, { nullable: true })
    @JoinColumn({ name: 'houseCommitteePayerUserId' })
    houseCommitteePayerUser?: User;

    @ApiProperty({ type: () => [UserApartment], description: 'Apartment residents' })
    @OneToMany(() => UserApartment, ua => ua.apartment, { cascade: true })
    residents: UserApartment[];

  @ApiProperty({ type: () => [Task], description: 'Apartment tasks' })
  @OneToMany(() => Task, (task) => task.apartmentId)
  tasks: Task[];

  @ApiProperty({ type: () => [Expense], description: 'Apartment expenses' })
  @OneToMany(() => Expense, (e) => e.apartmentId)
  expenses: Expense[];

  @ApiProperty({ type: () => [Payment], description: 'Apartment payments' })
  @OneToMany(() => Payment, (p) => p.apartmentId)
  payments: Payment[];

  @ApiProperty({ type: () => [Incident], description: 'Apartment incidents' })
  @OneToMany(() => Incident, (i) => i.apartmentId)
  incidents: Incident[];

  @ApiProperty({ type: () => [ShoppingTemplate], description: 'Apartment shopping templates' })
  @OneToMany(() => ShoppingTemplate, (st) => st.apartmentId)
  shoppingTemplates: ShoppingTemplate[];

  @ApiProperty({ type: () => [ShoppingList], description: 'Apartment shopping lists' })
  @OneToMany(() => ShoppingList, (sl) => sl.contextId)
  shoppingLists: ShoppingList[];

  @ApiProperty({ description: 'Date when the apartment was created' })
  @CreateDateColumn()
  createdAt: Date;
}
