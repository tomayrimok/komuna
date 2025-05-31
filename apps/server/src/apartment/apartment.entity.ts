import { BillsDetails } from '@komuna/types';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from '../expense/expense.entity';
import { Incident } from '../incident/incident.entity';
import { Payment } from '../payment/payment.entity';
import { ShoppingList } from '../shopping-list/shopping-list.entity';
import { ShoppingTemplate } from '../shopping-template/shopping-template.entity';
import { Task } from '../task/task.entity';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Apartment {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  apartmentId: string;

  /** Apartment Info */
  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ nullable: true })
  image?: string;

  @ApiProperty()
  /** The code to join the apartment. NULL in case the apartment doesn't allow new residents */
  @Column({ unique: true })
  code: string;

  @ApiProperty()
  /** Apartment Info */
  @Column({ nullable: true })
  address?: string;

  @ApiProperty()
  /** Apartment Info */
  @Column({ nullable: true })
  city?: string;

  @ApiProperty()
  @Column({ nullable: true })
  // TODO change to landLordId?!
  managerId?: string;

  @ApiProperty()
  /** Apartment Settings */
  @Column({ type: 'date', nullable: true })
  contractEndDate?: Date;

  @ApiProperty()
  /** contract file UserRole */
  @Column({ nullable: true })
  contractUrl?: string;

  @ApiProperty()
  @Column({ type: 'float', nullable: true })
  rent?: number;

  @ApiProperty()
  @Column({ nullable: true })
  contract?: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'jsonb' })
  billsDetails?: BillsDetails;

  @ApiProperty()
  /** Renter Settings */
  /** מחיר חושי ועד בית */
  @Column({ type: 'float', nullable: true })
  houseCommitteeRent: number;

  @ApiProperty({ type: () => User, nullable: true })
  /** Renter Settings */
  /** The user id of who pays the house committee, or NULL if it's split equally */
  @ManyToOne(() => User, (u) => u.userId, { nullable: true })
  @JoinColumn({ name: 'houseCommitteePayerUserId' })
  houseCommitteePayerUser?: User;

  @ApiProperty({ type: () => UserApartment, isArray: true })
  @ApiProperty()
  @OneToMany(() => UserApartment, (ua) => ua.apartment, { cascade: true })
  residents: UserApartment[];

  @ApiProperty({ type: () => UserApartment, isArray: true })
  @OneToMany(() => Task, (task) => task.apartmentId)
  tasks: Task[];

  @ApiProperty({ type: () => Expense, isArray: true })
  @OneToMany(() => Expense, (e) => e.apartmentId)
  expenses: Expense[];

  @ApiProperty({ type: () => Payment, isArray: true })
  @OneToMany(() => Payment, (p) => p.apartmentId)
  payments: Payment[];

  @ApiProperty({ type: () => Incident, isArray: true })
  @OneToMany(() => Incident, (i) => i.apartmentId)
  incidents: Incident[];

  @ApiProperty({ type: () => ShoppingTemplate, isArray: true })
  @OneToMany(() => ShoppingTemplate, (st) => st.apartmentId)
  shoppingTemplates: ShoppingTemplate[];

  @ApiProperty({ type: () => ShoppingList, isArray: true })
  @OneToMany(() => ShoppingList, (sl) => sl.contextId)
  shoppingLists: ShoppingList[];

  @ApiProperty({ type: () => User, nullable: true })
  @CreateDateColumn()
  createdAt: Date;
}
