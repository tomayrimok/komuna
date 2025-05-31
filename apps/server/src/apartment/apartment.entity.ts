import { BillsDetails } from '@komuna/types';
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { Incident } from '../incident/incident.entity';
import { Payment } from '../payment/payment.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { User } from '../user/user.entity';

@Entity()
export class Apartment {
  @PrimaryGeneratedColumn('uuid')
  apartmentId: string;

  /** Apartment Info */
  @Column()
  name: string;

  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ description: 'Unique code to join the apartment as a landlord. Can be NULL when the apartment already has a landlord' })
  @Column({ unique: true, nullable: true })
  landlordCode: string;

  @ApiProperty({ description: 'Unique code to join the apartment as a roommate. NULL in case the apartment doesn\'t allow new residents' })
  @Column({ unique: true, nullable: true })
  roommateCode: string;

  /** Apartment Info */
  @Column({ nullable: true })
  address?: string;

  /** Apartment Info */
  @Column({ nullable: true })
  city?: string;

  @ApiProperty({ description: 'Landlord User ID', required: false })
  @Column({ nullable: true })
  landlordUserId?: string;

  @ApiProperty({ description: 'Landlord of the apartment (Relation)', required: false })
  @ManyToOne(() => User, (ua) => ua.landlordApartments, { nullable: true })
  @JoinColumn({ name: 'landlordUserId', referencedColumnName: 'userId' })
  landlord?: User;

  @ApiProperty({ description: 'Apartment contract end date', required: false })
  @Column({ type: 'date', nullable: true })
  contractEndDate?: Date;

  /** Apartment Settings */
  @Column({ type: 'date', nullable: true })
  contractEndDate?: Date;

  /** contract file UserRole */
  @Column({ nullable: true })
  contractUrl?: string;

  @Column({ type: 'float', nullable: true })
  rent?: number;

  @Column({ nullable: true })
  contractUrl?: string;

  @ApiProperty({ description: 'Apartment rent', required: false })
  @Column({ type: 'float', nullable: true })
  rent?: number;

  @ApiProperty({ description: 'Bills payment details', required: false })
  @Column({ type: 'json', nullable: true })
  billsDetails?: BillsDetails;

  @ApiProperty({ description: 'Monthly house committee rent', required: false })
  @Column({ type: 'float', nullable: true })
  houseCommitteeRent: number;

  @ApiProperty({ description: 'User ID of the house committee payer. NULL if it\'s split equally', required: false })
  @ManyToOne(() => User, (u) => u.userId, { nullable: true })
  @JoinColumn({ name: 'houseCommitteePayerUserId' })
  houseCommitteePayerUser?: User;

  @ApiProperty({ type: () => [UserApartment], description: 'Apartment residents' })
  @OneToMany(() => UserApartment, ua => ua.apartment, { cascade: true })
  residents: UserApartment[];

  @OneToMany(() => Task, (task) => task.apartmentId)
  tasks: Task[];

  @OneToMany(() => Expense, (e) => e.apartmentId)
  expenses: Expense[];

  @OneToMany(() => Payment, (p) => p.apartmentId)
  payments: Payment[];

  @OneToMany(() => Incident, (i) => i.apartmentId)
  incidents: Incident[];

  @OneToMany(() => ShoppingTemplate, (st) => st.apartmentId)
  shoppingTemplates: ShoppingTemplate[];

  @OneToMany(() => ShoppingList, (sl) => sl.contextId)
  shoppingLists: ShoppingList[];

  @CreateDateColumn()
  createdAt: Date;
}
