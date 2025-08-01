import { Entity, Column, OneToMany, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserApartment } from '../user-apartment/user-apartment.entity';
import { Expense } from '../expense/expense.entity';
import { Apartment } from '../apartment/apartment.entity';
import { DebtEdge } from '../debt-edge/debt-edge.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Comment, Incident } from '../incident/incident.entity';
import { Task } from '../task/task.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  userId: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ unique: true })
  phoneNumber: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty({ description: "URL to user's profile image", required: false })
  @Column({ nullable: true })
  image?: string;

  @ApiProperty({ type: () => [UserApartment], description: "User's apartments" })
  @OneToMany(() => UserApartment, (ua) => ua.user)
  apartments: UserApartment[];

  @ApiProperty({ type: () => [Apartment], description: "User's apartments as landlord" })
  @OneToMany(() => Apartment, (a) => a.landlord)
  landlordApartments: Apartment[];

  @ApiProperty({ type: () => [UserApartment], description: "User's payable rents" })
  @OneToMany(() => UserApartment, (ua) => ua.payableByUser)
  payableRents: UserApartment[];

  /** House committee rents that this user pays */
  @OneToMany(() => Apartment, (a) => a.houseCommitteePayerUser)
  payableHouseCommitteeRents: Apartment[];

  @ApiProperty({ type: () => [Expense], description: "User's expenses" })
  @OneToMany(() => Expense, (e) => e.paidByUser)
  expenses: Expense[];

  @ApiProperty({ type: () => [DebtEdge], description: "User's debts" })
  @OneToMany(() => DebtEdge, (d) => d.fromUser)
  debts: DebtEdge[];

  @ApiProperty({ type: () => [DebtEdge], description: "User's credits" })
  @OneToMany(() => DebtEdge, (d) => d.toUser)
  credits: DebtEdge[];

  @ApiProperty({ description: 'The comments made by the user', type: () => [Comment] })
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ApiProperty({ description: 'The incidents reported by the user', type: () => [Incident] })
  @OneToMany(() => Incident, (incident) => incident.reporter)
  incidents: Incident[];

  @ApiProperty({ description: 'The tasks created by the user', type: () => [Task] })
  @OneToMany(() => Task, (task) => task.createdBy)
  createdTasks: Task[];

  @CreateDateColumn()
  createdAt: Date;
}
