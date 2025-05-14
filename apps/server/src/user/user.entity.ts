import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Expense } from '../expense/expense.entity';
import { DebtEdge } from '../debt-edge/debt-edge.entity';
import { Apartment } from '../apartment/apartment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @Column()
  firstName: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  image?: string;

  @OneToMany(() => UserApartment, (ua) => ua.user)
  apartments: UserApartment[];

  @OneToMany(() => UserApartment, (ua) => ua.payableByUser)
  payableRents: UserApartment[];

  /** House committee rents that this user pays */
  @OneToMany(() => Apartment, (a) => a.houseCommitteePayerUser)
  payableHouseCommitteeRents: Apartment[];

  @OneToMany(() => Expense, (e) => e.paidById)
  expenses: Expense[];

  @OneToMany(() => DebtEdge, (d) => d.fromUser)
  debts: DebtEdge[];

  @OneToMany(() => DebtEdge, (d) => d.toUser)
  credits: DebtEdge[];

  @CreateDateColumn()
  createdAt: Date;
}
